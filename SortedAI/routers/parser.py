from fastapi import APIRouter, UploadFile, File, HTTPException
from services.data_parser import extract_text_from_pdf, extract_transactions_from_excel
from services.llm import get_llm
from langchain_core.messages import HumanMessage, SystemMessage
import json

router = APIRouter()

@router.post("/parse-statement/{user_id}")
async def parse_statement(user_id: int, file: UploadFile = File(...)):
    try:
        contents = await file.read()
        filename = file.filename.lower()

        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            # Direct parsing — no LLM needed
            transactions = extract_transactions_from_excel(contents)
            print(f"Extracted {len(transactions)} transactions from Excel")
            for tx in transactions:
                tx["userId"] = user_id
            return {"transactions": transactions, "count": len(transactions)}

        elif filename.endswith(".pdf"):
            text = extract_text_from_pdf(contents)
            print(f"PDF text length: {len(text)}")

            chunk_size = 4000
            chunks = [text[i:i+chunk_size] for i in range(0, min(len(text), 20000), chunk_size)]

            all_transactions = []
            llm = get_llm()

            for chunk in chunks:
                if not chunk.strip():
                    continue
                try:
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
[{"date": "2026-01-30", "type": "Expense", "category": "Food", "amount": 75.00, "note": "HungerBox"}]
If no transactions found in this chunk return empty array []"""),
                        HumanMessage(content=f"Parse transactions from this chunk:\n\n{chunk}")
                    ]

                    response = llm.invoke(messages)
                    raw = response.content.strip()

                    if "```" in raw:
                        raw = raw.split("```")[1]
                        if raw.startswith("json"):
                            raw = raw[4:]

                    parsed = json.loads(raw.strip())
                    all_transactions.extend(parsed)

                except Exception:
                    continue

            seen = set()
            unique_transactions = []
            for tx in all_transactions:
                key = f"{tx.get('date')}_{tx.get('amount')}_{tx.get('note')}"
                if key not in seen:
                    seen.add(key)
                    tx["userId"] = user_id
                    unique_transactions.append(tx)

            return {"transactions": unique_transactions, "count": len(unique_transactions)}

        else:
            raise HTTPException(status_code=400, detail="Only PDF and Excel files are supported")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))