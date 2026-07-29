from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.java_client import get_transactions, get_income, get_expense, get_expense_by_category
from services.llm import get_llm
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: int
    message: str
    history: list = []

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        transactions = get_transactions(request.user_id)
        total_income = get_income(request.user_id)
        total_expense = get_expense(request.user_id)
        category_breakdown = get_expense_by_category(request.user_id)
        balance = total_income - total_expense

        context = f"""
User Financial Data:
- Total Income: ₹{total_income}
- Total Expenses: ₹{total_expense}
- Balance: ₹{balance}
- Expense by Category: {category_breakdown}
- Recent Transactions: {transactions[:10]}
"""

        llm = get_llm()
        messages = [
            SystemMessage(content=f"""You are Sorted AI, a personal financial advisor for an user.
You have access to the user's real financial data. Use it to give specific, helpful advice.
Keep responses concise and friendly. Use ₹ for currency.
User's financial context:
{context}"""),
        ]

        for msg in request.history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                from langchain_core.messages import AIMessage
                messages.append(AIMessage(content=msg["content"]))

        messages.append(HumanMessage(content=request.message))

        response = llm.invoke(messages)
        return {"response": response.content}

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))