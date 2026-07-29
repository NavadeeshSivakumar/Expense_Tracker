package com.example.expensetracker.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.expensetracker.entity.Transactions;

public interface TransactionsRepository extends JpaRepository<Transactions, Integer> {

    List<Transactions> getTransactionsByUserId(int userId);

}
