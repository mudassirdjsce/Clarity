from models.portfolio_model import save_portfolio


async def build_portfolio(query: str, session_id: str) -> dict:
    q = query.lower()

    if any(k in q for k in ("low risk", "safe", "conservative", "capital preservation")):
        allocation = {"bonds": 50, "mutual_funds": 30, "stocks": 20}
        profile = "conservative"
    elif any(k in q for k in ("high risk", "aggressive", "growth", "maximum return")):
        allocation = {"stocks": 75, "mutual_funds": 20, "bonds": 5}
        profile = "aggressive"
    else:
        allocation = {"stocks": 60, "mutual_funds": 25, "bonds": 15}
        profile = "moderate"

    await save_portfolio(session_id, allocation, profile)

    return {
        "allocation": allocation,
        "risk_profile": profile,
    }