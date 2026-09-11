package com.example.txnora.repository;

import com.example.txnora.model.TransactionHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * to save transaction history in the db
 */
@Repository
public interface TransactionHistoryRepository extends MongoRepository<TransactionHistory,String>
{
    Optional<TransactionHistory> findByTransactionId(String transactionId);
}
