from fastapi import APIRouter

router = APIRouter()

@router.get("/login/access-token")
def login_access_token():
    return {"access-token": "token"}

 