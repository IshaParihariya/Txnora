package com.example.txnora.model;

import com.example.txnora.enums.TransactionStatus;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

/**
 * This is a piece of data inside the TransactionHistory document
 */
public class StatusHistoryEntry
{
    @NotNull
    private TransactionStatus status;

    @NotNull
    private Instant timestamp;


    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "StatusHistoryEntry{" +
                "status=" + status +
                ", timestamp=" + timestamp +
                '}';
    }

}
