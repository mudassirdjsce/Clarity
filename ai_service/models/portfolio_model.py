from database import portfolio_collection


async def save_portfolio(session_id: str, allocation: dict, profile: str) -> None:
    await portfolio_collection.update_one(
        {"session_id": session_id},
        {"$set": {"allocation": allocation, "risk_profile": profile}},
        upsert=True,
    )


async def get_portfolio(session_id: str) -> dict | None:
    return await portfolio_collection.find_one({"session_id": session_id}, {"_id": 0})