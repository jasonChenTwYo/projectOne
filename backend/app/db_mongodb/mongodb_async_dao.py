from odmantic import ObjectId
from pymongo import ReturnDocument
from app.db_mongodb.mongodb_engine import async_engine
from app.db_mongodb.mongodb_models import LoginToken, ReplyComment, VideoComment


async def find_login_token_by_access_token(access_token: str) -> LoginToken:
    login_token = await async_engine.find_one(
        LoginToken, LoginToken.access_token == access_token
    )
    return login_token


async def delete_login_token(user_id: str):
    await async_engine.remove(
        LoginToken, LoginToken.user_id == str(user_id), just_one=True
    )


async def save_video_comment(account: str, video_id: str, comment_message: str):
    video_comment = VideoComment(
        account=account, video_id=video_id, comment_message=comment_message, replies=[]
    )
    await async_engine.save(video_comment)


async def find_video_comment(video_id: str):
    comments = await async_engine.find(VideoComment, VideoComment.video_id == video_id)
    return comments


async def add_reply_to_video_comment(
    video_comment_id: str, account: str, comment_message: str
):
    collection = async_engine.get_collection(VideoComment)

    new_reply = ReplyComment(
        account=account, comment_message=comment_message
    ).model_dump()

    # 使用 find_one_and_update 方法原子性地更新文档
    updated_document = await collection.find_one_and_update(
        {"_id": ObjectId(video_comment_id)},
        {"$push": {"replies": new_reply}},
        return_document=ReturnDocument.AFTER,
    )

    return updated_document


async def delete_reply_to_video_comment(
    video_comment_id: str, reply_id: str, account: str
):
    collection = async_engine.get_collection(VideoComment)

    updated_document = await collection.find_one_and_update(
        {"_id": ObjectId(video_comment_id)},
        {"$pull": {"replies": {"id": reply_id, "account": account}}},
        return_document=ReturnDocument.AFTER,
    )

    return updated_document


# async def delete_reply_to_video_comment(
#     video_comment_id: str, reply_id: str, account: str
# ):
#     collection = async_engine.get_collection(VideoComment)

#     updated_document = await collection.find_one_and_update(
#         {"_id": ObjectId(video_comment_id)},
#         {"$set": {"replies.$[elem].comment_message": "回覆已被刪除"}},
#         array_filters=[{"elem.id": reply_id, "elem.account": account}],
#         return_document=ReturnDocument.AFTER,
#     )

#     return updated_document
