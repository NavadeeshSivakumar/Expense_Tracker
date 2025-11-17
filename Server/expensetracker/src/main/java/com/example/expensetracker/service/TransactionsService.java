package com.example.expensetracker.service;


import java.util.List;
import java.util.Optional;
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


    public List<Transactions> getAllTransactions()
    {
        return tr.findAll();
    }

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

    public Transactions editTransaction(int id, Transactions transactions)
    {
        Optional<Transactions> tempt = tr.findById(id);
        
        Transactions existingTransaction = tempt.get();
        existingTransaction.setUser(transactions.getUser());
        existingTransaction.setType(transactions.getType());
        existingTransaction.setCategory(transactions.getCategory());
        existingTransaction.setAmount(transactions.getAmount());
        existingTransaction.setDate(transactions.getDate());
        existingTransaction.setNote(transactions.getNote());

        return tr.save(existingTransaction);
    }

}
