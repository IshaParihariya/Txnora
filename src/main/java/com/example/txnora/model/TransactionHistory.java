package com.example.txnora.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

/**
 * for storing all the transaction history with all these details
 */
@Document(collection = "transaction_history")
public class TransactionHistory
{
    @Id
    private String id;

    @NotBlank
    private String transactionId;

    @NotNull
    private List<StatusHistoryEntry> statusHistory;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public List<StatusHistoryEntry> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<StatusHistoryEntry> statusHistory) {
        this.statusHistory = statusHistory;
    }

    @Override
    public String toString() {
        return "TransactionHistory{" +
                "id='" + id + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", statusHistory=" + statusHistory +
                '}';
    }
}
