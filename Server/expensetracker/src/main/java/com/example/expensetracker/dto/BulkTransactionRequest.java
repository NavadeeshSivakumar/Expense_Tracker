package com.example.expensetracker.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class BulkTransactionRequest {

    private int userId;
    private List<TransactionItem> transactions;

    @Getter
    @Setter
    public static class TransactionItem {

        @NotBlank(message = "Type is required")
        private String type;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be greater than zero")
        private Double amount;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private String note;
    }
}