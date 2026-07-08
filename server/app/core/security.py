import jwt

from datetime import datetime
from datetime import timedelta

from passlib.context import CryptContext

from core.config import config

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_access_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        hours=config.JWT_EXPIRE_HOURS
    )

    payload["exp"] = expire

    return jwt.encode(
        payload,
        config.JWT_SECRET,
        algorithm=config.JWT_ALGORITHM
    )


def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            config.JWT_SECRET,
            algorithms=[config.JWT_ALGORITHM]
        )

        return payload

    except Exception:

        return None