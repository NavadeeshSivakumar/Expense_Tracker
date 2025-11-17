package com.example.expensetracker.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.expensetracker.entity.Transactions;
import com.example.expensetracker.service.TransactionsService;

import lombok.val;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;



@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TransactionsController {
    @Autowired
    private TransactionsService ts;

    @GetMapping("/getAllTransactions")
    public List<Transactions> getAllTransactions() {
        return ts.getAllTransactions();
    }

    @GetMapping("/getTransactionsByUserId")
    public List<Transactions> getTransactionsByUserId(@RequestParam int userId) {
        return ts.getTransactionsByUserId(userId);
    }

    @PostMapping("/addTransaction")
    public Transactions addTransaction(@RequestBody Transactions transactions) {
        return ts.addTransaction(transactions);
    }

    @DeleteMapping("/deleteTransaction/{id}")
    public void deleteTransaction(@PathVariable int id)
    {
        ts.deleteTransaction(id);
    }

    @PutMapping("/editTransaction/{id}")
    public Transactions editTransaction(@PathVariable int id, @RequestBody Transactions transactions) {
        return ts.editTransaction(id, transactions);
    }
    
    @GetMapping("/getIncomeByUserId")
    public Double getIncomeByUserId(@RequestParam int userId) {
        Double totalIncome = 0.0; 
        List<Transactions> allTransactions = ts.getTransactionsByUserId(userId);
        for(Transactions t : allTransactions)
        {
            if(t.getType().equalsIgnoreCase("income"))
            {
                totalIncome += t.getAmount();
            }
        }
        return totalIncome;
    }

    @GetMapping("/getExpenseByUserId")
    public Double getExpenseByUserId(@RequestParam int userId) {
        Double totalExpense = 0.0; 
        List<Transactions> allTransactions = ts.getTransactionsByUserId(userId);
        for(Transactions t : allTransactions)
        {
            if(t.getType().equalsIgnoreCase("expense"))
            {
                totalExpense += t.getAmount();
            }
        }
        return totalExpense;
    }
    
    @GetMapping("/getMonthlyExpenses")
    public Map<Integer, Double> getMonthlyExpenses(@RequestParam int userId) {
        Map<Integer, Double> monthlyExpenses = new HashMap<>();
        List<Transactions> allTransactions = ts.getTransactionsByUserId(userId);
        for (Transactions t : allTransactions) 
        {
            LocalDate date = t.getDate();
            int month = date.getMonthValue();
            double amount = t.getAmount();
            monthlyExpenses.put(month, monthlyExpenses.getOrDefault(month, 0.0) + amount);
        }
        return monthlyExpenses;
    }

    @GetMapping("/getExpenseByCategory")
    public Map<String, Double> getMethodName(@RequestParam int userId) {
        Map<String, Double> categoryMap = new HashMap<>();
        List<Transactions> allTransactions = ts.getTransactionsByUserId(userId);
        for (Transactions t : allTransactions) 
        {
            String category = t.getCategory();
            double amount = t.getAmount();
            categoryMap.put(category, categoryMap.getOrDefault(category, 0.0) + amount);
        }
        return categoryMap;
    }
    

    
    
    
    
    

}
