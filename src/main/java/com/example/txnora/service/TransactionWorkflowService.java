package com.example.txnora.service;

import com.example.txnora.enums.TransactionStatus;
import com.example.txnora.model.RiskEvaluationResult;
import com.example.txnora.model.Transaction;
import org.springframework.stereotype.Service;

/**
 * this is for the processing of the transaction and further lifecycles
 * to trigger the transaction lifecycles..
 */
@Service
public class TransactionWorkflowService {
    private final TransactionService transactionService;
    private final RiskService riskService;

    public TransactionWorkflowService(TransactionService transactionService, RiskService riskService) {
        this.transactionService = transactionService;
        this.riskService = riskService;

    }

    public Transaction processTransaction(String id)
    {

        //here we made changes cuz we had an another idempotency problem
        //if status = authorized and it fails
        //retry will again start from start processing
        //but as already authorized so it will be an error
        //here we are continuing from where it failed

        // First: get the CURRENT state from MongoDB
        Transaction transaction =
                transactionService.getTransactionService(id);


        // Already completely handled
        if (transaction.getStatus() == TransactionStatus.SETTLED ||
                transaction.getStatus() == TransactionStatus.FAILED) {
            return transaction;
        }

        // If still INITIATED, start processing
        if (transaction.getStatus() == TransactionStatus.INITIATED) {
            transaction = transactionService.startProcessing(id);

            // Risk check before authorization
            RiskEvaluationResult riskEvaluationResult=riskService.isRisky(transaction);
            if (!riskEvaluationResult.isApproved()) {
                return transactionService.changeStatus(
                        id,
                        TransactionStatus.FAILED
                );
            }
        }

        // If PROCESSING, authorize
        if (transaction.getStatus() == TransactionStatus.PROCESSING) {

            transaction = transactionService.authorizeTransaction(id);

            // Check if transaction is eligible for settlement
            RiskEvaluationResult riskEvaluationResult= riskService.isEligibleForSettlement(transaction);
            if (!riskEvaluationResult.isApproved()) {

                return transactionService.changeStatus(
                        id,
                        TransactionStatus.FAILED
                );
            }
        }

        // If AUTHORIZED, start settlement
        if (transaction.getStatus() == TransactionStatus.AUTHORIZED) {

            transaction = transactionService.startSettlement(id);

        }

        // If SETTLEMENT_PENDING, complete settlement
        if (transaction.getStatus() == TransactionStatus.SETTLEMENT_PENDING) {

            // Check if settlement can still be completed
            RiskEvaluationResult riskEvaluationResult= riskService.canCompleteSettlement(transaction);
            if (!riskEvaluationResult.isApproved()) {

                return transactionService.changeStatus(
                        id,
                        TransactionStatus.FAILED
                );
            }

            transaction = transactionService.completeSettlement(id);
        }

        return transaction;
    }
}