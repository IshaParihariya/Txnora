package com.example.txnora.service;

import com.example.txnora.model.RiskEvaluationResult;
import com.example.txnora.model.Transaction;
import com.example.txnora.model.TransactionHistory;
import com.example.txnora.dto.TransactionInvestigation;
import com.example.txnora.repository.RiskEvaluationResultRepository;
import com.example.txnora.repository.TransactionHistoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * gathers the data from our existing Mongo collections for investigation purpose
 */
@Service
@Slf4j
public class InvestigationService {

    private final TransactionService transactionService;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final RiskEvaluationResultRepository riskEvaluationResultRepository;

    public InvestigationService(
            TransactionService transactionService,
            TransactionHistoryRepository transactionHistoryRepository,
            RiskEvaluationResultRepository riskEvaluationResultRepository) {

        this.transactionService = transactionService;
        this.transactionHistoryRepository = transactionHistoryRepository;
        this.riskEvaluationResultRepository = riskEvaluationResultRepository;
    }

    public TransactionInvestigation investigate(String transactionId) {

        log.info("inside Investigation service investigate method");

        // Get transaction
        Transaction transaction =
                transactionService.getTransactionService(transactionId);

        log.info("inside Investigation service investigate method : "+transaction.getId());

        // Get transaction history
        TransactionHistory transactionHistory =
                transactionHistoryRepository
                        .findByTransactionId(transactionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Transaction history not found for transaction: "
                                                + transactionId
                                )
                        );

        log.info("inside Investigation service investigate method : "+transactionHistory.getStatusHistory());

        // Get all risk evaluation results
        List<RiskEvaluationResult> riskEvaluationResults =
                riskEvaluationResultRepository
                        .findByTransactionId(transactionId);

        log.info("inside Investigation service investigate method : "+riskEvaluationResults);


        // Combine everything
        return new TransactionInvestigation(
                transaction,
                transactionHistory,
                riskEvaluationResults
        );
    }
}