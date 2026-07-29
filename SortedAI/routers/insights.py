from fastapi import APIRouter, HTTPException
from services.java_client import get_transactions, get_income, get_expense, get_expense_by_category
from services.llm import get_llm
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter()

@router.get("/insights/{user_id}")
async def get_insights(user_id: int):
    try:
        transactions = get_transactions(user_id)
        total_income = get_income(user_id)
        total_expense = get_expense(user_id)
        category_breakdown = get_expense_by_category(user_id)

        if not transactions:
            return {"insights": []}

        balance = total_income - total_expense
        savings_rate = ((total_income - total_expense) / total_income * 100) if total_income > 0 else 0

        context = f"""
User Financial Summary:
- Total Income: ₹{total_income}
- Total Expenses: ₹{total_expense}
- Balance: ₹{balance}
- Savings Rate: {savings_rate:.1f}%
- Expense by Category: {category_breakdown}
- Total Transactions: {len(transactions)}
"""

        llm = get_llm()
        messages = [
            SystemMessage(content="""You are a personal financial advisor AI for an Indian user.
                Analyze the user's financial data and generate exactly 4 concise, actionable insights.
                Each insight should be a single sentence.
                Be specific with numbers where relevant.
                Use the rupee symbol as 'Rs.' instead of the ₹ symbol.
                Format your response as exactly 4 insights, one per line, numbered 1-4.
                No extra text, no headers, just the 4 numbered insights."""),
            HumanMessage(content=f"Generate 4 financial insights for this user:\n{context}")
        ]

        response = llm.invoke(messages)
        raw = response.content.strip()

        insights = []
        for line in raw.split("\n"):
            line = line.strip()
            if line and line[0].isdigit():
                cleaned = line.split(".", 1)[-1].strip() if "." in line else line
                insights.append(cleaned)

        return {"insights": insights[:4]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))