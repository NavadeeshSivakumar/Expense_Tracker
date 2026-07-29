from fastapi import APIRouter, UploadFile, File, HTTPException
from SortedAI.services.pdf.excel_parser import extract_text_from_pdf, extract_text_from_excel
from services.llm import get_llm
from langchain_core.messages import HumanMessage, SystemMessage
import json

router = APIRouter()

@router.post("/parse-statement/{user_id}")
async def parse_statement(user_id: int, file: UploadFile = File(...)):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".pdf"):
            text = extract_text_from_pdf(contents)
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            text = extract_text_from_excel(contents)
        else:
            raise HTTPException(status_code=400, detail="Only PDF and Excel files are supported")

        llm = get_llm()
        messages = [
            SystemMessage(content="""You are a bank statement parser.
                Extract all transactions from the provided bank statement text.
                Return ONLY a valid JSON array with no extra text or markdown.
                Each transaction must have these exact fields:
                - date: string in YYYY-MM-DD format
                - type: either "Income" or "Expense" (Deposit = Income, Withdrawal = Expense)
                - category: one of [Salary, Freelance, Food, Transport, Shopping, Entertainment, Health, Utilities, Rent, Other]
                - amount: number (positive value only)
                - note: short description from transaction remarks (merchant name or transaction type)

                Example format:
                [{"date": "2026-07-26", "type": "Expense", "category": "Food", "amount": 75.00, "note": "UIDAI"}]"""),
            HumanMessage(content=f"Parse this bank statement and return JSON only:\n\n{text}")
        ]

        response = llm.invoke(messages)
        raw = response.content.strip()

        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        transactions = json.loads(raw.strip())

        for tx in transactions:
            tx["userId"] = user_id

        return {"transactions": transactions, "count": len(transactions)}

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Failed to parse transactions from statement")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))