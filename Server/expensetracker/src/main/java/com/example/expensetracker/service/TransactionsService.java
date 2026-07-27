package com.example.expensetracker.service;


import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.expensetracker.entity.Transactions;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.TransactionsRepository;
import com.example.expensetracker.repository.UserRepository;

@Service
public class TransactionsService {
    @Autowired
    private TransactionsRepository tr;
    @Autowired
    private UserRepository ur;

    public List<Transactions> getTransactionsByUserId(int userId)
    {
        return tr.getTransactionsByUserId(userId);
    }

    public Transactions addTransaction(Transactions transactions)
    {
        User user = ur.findById(transactions.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        transactions.setUser(user);
        return tr.save(transactions);
    }

    public void deleteTransaction(int id)
    {
        tr.deleteById(id);
    }

    public Transactions editTransaction(int id, Transactions transactions) {
        Transactions existing = tr.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));

        existing.setUser(transactions.getUser());
        existing.setType(transactions.getType());
        existing.setCategory(transactions.getCategory());
        existing.setAmount(transactions.getAmount());
        existing.setDate(transactions.getDate());
        existing.setNote(transactions.getNote());

        return tr.save(existing);
    }

    public Double getTotalIncomeByUserId(int userId) {
    return getTransactionsByUserId(userId).stream()
        .filter(t -> t.getType().equalsIgnoreCase("income"))
        .mapToDouble(Transactions::getAmount)
        .sum();
    }

    public Double getTotalExpenseByUserId(int userId) {
        return getTransactionsByUserId(userId).stream()
            .filter(t -> t.getType().equalsIgnoreCase("expense"))
            .mapToDouble(Transactions::getAmount)
            .sum();
    }

    public Map<Integer, Double> getMonthlyExpenses(int userId) {
        Map<Integer, Double> monthlyExpenses = new HashMap<>();
        getTransactionsByUserId(userId).stream()
            .filter(t -> t.getType().equalsIgnoreCase("expense"))
            .forEach(t -> {
                int month = t.getDate().getMonthValue();
                monthlyExpenses.merge(month, t.getAmount(), Double::sum);
            });
        return monthlyExpenses;
    }

    public Map<String, Double> getExpenseByCategory(int userId) {
        Map<String, Double> categoryMap = new HashMap<>();
        getTransactionsByUserId(userId).stream()
            .filter(t -> t.getType().equalsIgnoreCase("expense"))
            .forEach(t -> categoryMap.merge(t.getCategory(), t.getAmount(), Double::sum));
        return categoryMap;
    }

}
