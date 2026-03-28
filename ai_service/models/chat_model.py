from database import chat_collection
from datetime import datetime, timezone


async def save_chat(session_id: str, user_msg: str, bot_response: dict) -> None:
    await chat_collection.insert_one({
        "session_id":   session_id,
        "user_message": user_msg,
        "bot_response": bot_response,
        "timestamp":    datetime.now(timezone.utc),
    })
