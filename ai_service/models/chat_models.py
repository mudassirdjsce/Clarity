from database import chat_collection
from datetime import datetime

def save_chat(session_id, user_msg, bot_response):
    chat_collection.insert_one({
        "session_id": session_id,
        "user_message": user_msg,
        "bot_response": bot_response,
        "timestamp": datetime.utcnow()
    })