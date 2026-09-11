package com.example.txnora.repository;

import com.example.txnora.model.RiskEvaluationResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * stores the results of why the transaction failed in the db
 * for investigation purpose
 */
@Repository
public interface RiskEvaluationResultRepository extends MongoRepository<RiskEvaluationResult,String>
{
    public List<RiskEvaluationResult> findByTransactionId(String transactionId);
}
