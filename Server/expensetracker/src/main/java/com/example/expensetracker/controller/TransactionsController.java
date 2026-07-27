package com.example.expensetracker.controller;


import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.expensetracker.entity.Transactions;
import com.example.expensetracker.service.TransactionsService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
public class TransactionsController {
    @Autowired
    private TransactionsService ts;

    @GetMapping("/getTransactionsByUserId")
    public List<Transactions> getTransactionsByUserId(@RequestParam int userId) {
        return ts.getTransactionsByUserId(userId);
    }

    @PostMapping("/addTransaction")
    public Transactions addTransaction(@Valid @RequestBody Transactions transactions) {
        return ts.addTransaction(transactions);
    }

    @DeleteMapping("/deleteTransaction/{id}")
    public void deleteTransaction(@PathVariable int id)
    {
        ts.deleteTransaction(id);
    }

    @PutMapping("/editTransaction/{id}")
    public Transactions editTransaction(@PathVariable int id,@Valid @RequestBody Transactions transactions) {
        return ts.editTransaction(id, transactions);
    }
    
    @GetMapping("/getIncomeByUserId")
    public Double getIncomeByUserId(@RequestParam int userId) {
        return ts.getTotalIncomeByUserId(userId);
    }

    @GetMapping("/getExpenseByUserId")
    public Double getExpenseByUserId(@RequestParam int userId) {
        return ts.getTotalExpenseByUserId(userId);
    }

    @GetMapping("/getMonthlyExpenses")
    public Map<Integer, Double> getMonthlyExpenses(@RequestParam int userId) {
        return ts.getMonthlyExpenses(userId);
    }

    @GetMapping("/getExpenseByCategory")
    public Map<String, Double> getExpenseByCategory(@RequestParam int userId) {
        return ts.getExpenseByCategory(userId);
    }

}
