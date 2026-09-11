package com.example.txnora.service;

import com.example.txnora.model.StatusHistoryEntry;
import com.example.txnora.model.Transaction;
import com.example.txnora.model.TransactionHistory;
import com.example.txnora.repository.TransactionHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;

/**
 * transaction history logic is here
 * in order to save the records of the status of the transcations
 */
@Slf4j
@Service
public class TransactionHistoryService
{
    private final TransactionHistoryRepository transactionHistoryRepository;

    public TransactionHistoryService(TransactionHistoryRepository transactionHistoryRepository) {
        this.transactionHistoryRepository = transactionHistoryRepository;
    }

    //we are just starting to create the transaction history
    //WE HAD AN ERROR BCUZ OF THIS CONFUSION KEEP IT IN MIND
    public void createHistory(Transaction transaction)
    {
        TransactionHistory transactionHistory = new TransactionHistory();

        transactionHistory.setTransactionId(transaction.getId());

        StatusHistoryEntry entry = new StatusHistoryEntry();
        entry.setStatus(transaction.getStatus());
        entry.setTimestamp(transaction.getUpdatedAt());

        transactionHistory.setStatusHistory(new ArrayList<>());
        transactionHistory.getStatusHistory().add(entry);

        transactionHistoryRepository.save(transactionHistory);
    }

    //here we are updating it
    public void recordStatusChange(Transaction savedTransaction)
    {
        //debugging
        log.info("in recordStatus method");

        TransactionHistory transactionHistory=transactionHistoryRepository
                .findByTransactionId(savedTransaction.getId())
                .orElseThrow(
                        ()-> new RuntimeException(
                                "Transaction history not found for transaction: "
                                        + savedTransaction.getId()
                ));

        StatusHistoryEntry entry =new StatusHistoryEntry();
        entry.setStatus(savedTransaction.getStatus());
        entry.setTimestamp(savedTransaction.getUpdatedAt());

        //debugging
        log.info("status history added");

        if (transactionHistory.getStatusHistory() == null) {
            transactionHistory.setStatusHistory(new ArrayList<>());
        }

        transactionHistory.getStatusHistory().add(entry);

        transactionHistoryRepository.save(transactionHistory);

    }

}
