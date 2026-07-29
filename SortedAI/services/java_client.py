import requests
import os
from dotenv import load_dotenv

load_dotenv()

JAVA_BASE_URL = os.getenv("JAVA_BASE_URL")
SERVICE_TOKEN = os.getenv("INTERNAL_SERVICE_TOKEN")

HEADERS = {
    "X-Service-Token": SERVICE_TOKEN,
    "Content-Type": "application/json",
    "Accept-Charset": "UTF-8"
}

def get_transactions(user_id: int):
    print(f"Service token: {SERVICE_TOKEN}")
    response = requests.get(
        f"{JAVA_BASE_URL}/getTransactionsByUserId",
        params={"userId": user_id},
        headers=HEADERS
    )
    response.raise_for_status()
    return response.json()

def get_income(user_id: int):
    response = requests.get(
        f"{JAVA_BASE_URL}/getIncomeByUserId",
        params={"userId": user_id},
        headers=HEADERS
    )
    response.raise_for_status()
    return response.json()

def get_expense(user_id: int):
    response = requests.get(
        f"{JAVA_BASE_URL}/getExpenseByUserId",
        params={"userId": user_id},
        headers=HEADERS
    )
    response.raise_for_status()
    return response.json()

def get_monthly_expenses(user_id: int):
    response = requests.get(
        f"{JAVA_BASE_URL}/getMonthlyExpenses",
        params={"userId": user_id},
        headers=HEADERS
    )
    response.raise_for_status()
    return response.json()

def get_expense_by_category(user_id: int):
    response = requests.get(
        f"{JAVA_BASE_URL}/getExpenseByCategory",
        params={"userId": user_id},
        headers=HEADERS
    )
    response.raise_for_status()
    return response.json()