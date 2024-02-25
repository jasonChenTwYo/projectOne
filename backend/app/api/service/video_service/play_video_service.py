import os, logging
from pathlib import Path
from typing import Optional
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from app.api.request import PlayVideoRequest
from app.config.config import settings


def play_video(
    range_header: Optional[str], play_video_request: PlayVideoRequest
) -> StreamingResponse:
    video_name = play_video_request.video_name
    group_id = play_video_request.group_id
    if not validate_inputs([video_name, group_id]):
        raise HTTPException(status_code=400, detail="file name invalid")

    # 獲取影片檔案的大小
    video_name = video_name + ".mp4"
    video_path = Path(settings.VIDEO_BASE_PATH) / group_id / video_name
    file_size = os.path.getsize(video_path)

    if range_header:
        range_start, range_end = parse_range_header(range_header, file_size)

        # 生成響應頭中的 Content-Range 字段值
        content_range = f"bytes {range_start}-{range_end}/{file_size}"
        headers = {"Content-Range": content_range}

        # 返回部分內容響應
        return StreamingResponse(
            content=video_stream(video_path, range_start, range_end),
            headers=headers,
            status_code=206,
            media_type="video/mp4",
        )

    # 如果請求中沒有 Range 頭，那麼返回整個影片檔案
    else:
        return StreamingResponse(
            content=full_video_stream(video_path),
            media_type="video/mp4",
        )


def video_stream(video_path: Path, range_start: int, range_end: int):
    with open(video_path, "rb") as video:
        video.seek(range_start)  # 移動檔案指針到起始位置
        while True:
            bytes_read = video.read(range_end - range_start + 1)  # 讀取指定範圍的數據
            if not bytes_read:
                break
            yield bytes_read


def parse_range_header(range_header: str, file_size: int) -> tuple[int, int]:
    """
    解析 Range 頭，返回起始和結束範圍。

    :param range_header: 從請求中獲得的 Range 頭的值，例如 "bytes=200-1000"。
    :param file_size: 文件的總大小。
    :return: 一個元組 (range_start, range_end)。
    """
    range_start, range_end = range_header.removeprefix("bytes=").split("-")
    range_start = int(range_start)
    range_end = (
        int(range_end) if range_end else file_size - 1
    )  # 如果沒有指定結束範圍，則默認到檔案末尾
    return range_start, range_end


def full_video_stream(video_path: Path):
    with open(video_path, "rb") as video:
        yield from video


def validate_inputs(inputs: list[str]) -> bool:
    for input_str in inputs:
        # 檢查是否含有路徑分隔符
        if os.path.sep in input_str or (os.path.altsep and os.path.altsep in input_str):
            logging.error(f"檔案名不應包含路徑分隔符: {input_str}")
            return False
        # 使用 pathlib 檢查是否僅為檔案名
        path = Path(input_str)
        if path.parent != Path("."):
            logging.error(f"不允許路徑導航符號: {input_str}")
            return False
    # 所有輸入均有效
    return True
