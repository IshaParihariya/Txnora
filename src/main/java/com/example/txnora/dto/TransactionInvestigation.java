package com.example.txnora.dto;

import com.example.txnora.enums.RiskRule;
import com.example.txnora.model.RiskEvaluationResult;
import com.example.txnora.model.Transaction;
import com.example.txnora.model.TransactionHistory;

import java.util.List;

/**
 * Response object containing transaction investigation details.
 *  response object
 *  this is for getting the whole data about the transaction
 *  why it failed
 * what steps it went through
 *  this data we're getting from the backend itself
 *
 */
public class TransactionInvestigation {

    private Transaction transaction;
    private TransactionHistory transactionHistory;
    private List<RiskEvaluationResult> riskEvaluationResults;

    // Actual recorded reason for a failed transaction, when available.
    private String failureReason;
    private RiskRule failureRule;

    public TransactionInvestigation() {
    }

    public TransactionInvestigation(
            Transaction transaction,
            TransactionHistory transactionHistory,
            List<RiskEvaluationResult> riskEvaluationResults) {

        this.transaction = transaction;
        this.transactionHistory = transactionHistory;
        this.riskEvaluationResults = riskEvaluationResults;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public TransactionHistory getTransactionHistory() {
        return transactionHistory;
    }

    public void setTransactionHistory(TransactionHistory transactionHistory) {
        this.transactionHistory = transactionHistory;
    }

    public List<RiskEvaluationResult> getRiskEvaluationResults() {
        return riskEvaluationResults;
    }

    public void setRiskEvaluationResults(
            List<RiskEvaluationResult> riskEvaluationResults) {
        this.riskEvaluationResults = riskEvaluationResults;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public RiskRule getFailureRule() {
        return failureRule;
    }

    public void setFailureRule(RiskRule failureRule) {
        this.failureRule = failureRule;
    }
}
