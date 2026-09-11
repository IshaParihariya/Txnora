package com.example.txnora.service;

import com.example.txnora.enums.MerchantStatus;
import com.example.txnora.enums.RiskRule;
import com.example.txnora.enums.TransactionStatus;
import com.example.txnora.exception.MerchantNotFoundException;
import com.example.txnora.model.Merchant;
import com.example.txnora.model.RiskEvaluationResult;
import com.example.txnora.model.Transaction;
import com.example.txnora.repository.MerchantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * to do all risk analysis if there are no risks in authorising this particular transaction..
 * also adding after authorisation
 * and after settlement pending status the conditions in this only
 */
@Slf4j
@Service
public class RiskService
{
    private final MerchantRepository merchantRepository;
    //risk evaluation service
    private final RiskEvaluationService riskEvaluationService;

    public RiskService(MerchantRepository merchantRepository, RiskEvaluationService riskEvaluationService)
    {
        this.merchantRepository = merchantRepository;
        this.riskEvaluationService = riskEvaluationService;
    }

    //before authorization
    public RiskEvaluationResult isRisky(Transaction transaction)
    {
        //debugging purpose
        log.info("RISK CHECK STARTED for transaction: {}", transaction.getId());

        return riskEvaluationService.riskEvaluation(transaction);
    }

    //after authorization
        public RiskEvaluationResult isEligibleForSettlement(Transaction transaction)
    {
        // Transaction must be AUTHORIZED
        if (transaction.getStatus() != TransactionStatus.AUTHORIZED)
        {
            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.INVALID_TRANSACTION_STATUS,
                    "Transaction is not in AUTHORIZED status"
            );
        }

        //  Authorization validity - 30 minutes
        Instant authorizationTime = transaction.getUpdatedAt();

        if (authorizationTime == null ||
                authorizationTime.isBefore(Instant.now().minus(30, ChronoUnit.MINUTES)))
        {
            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.AUTHORIZATION_EXPIRED,
                    "Authorization has expired"
            );
        }

        // Merchant must still be active
        Merchant merchant = merchantRepository.findById(transaction.getMerchantId())
                .orElseThrow(() -> new MerchantNotFoundException("Merchant not found!"));

        if (merchant.getMerchantStatus() != MerchantStatus.ACTIVE)
        {
            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.MERCHANT_SUSPENDED,
                    "Merchant account is not active"
            );
        }

        // Settlement amount must < 1,00,000
        if (transaction.getAmount().compareTo(new BigDecimal("100000"))>0)
        {

            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.SETTLEMENT_AMOUNT_LIMIT,
                    "Settlement amount exceeds 100000"
            );
        }
        // Everything passed
        return riskEvaluationService.saveResult(
                transaction.getId(),
                true,
                null,
                "Transaction is eligible for settlement"
        );
    }

    //after settlement pending
    //for finally completing the settlement
    public RiskEvaluationResult canCompleteSettlement(
            Transaction transaction) {

        // Must be SETTLEMENT_PENDING
        if (transaction.getStatus()
                != TransactionStatus.SETTLEMENT_PENDING) {

            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.INVALID_TRANSACTION_STATUS,
                    "Transaction is not in SETTLEMENT_PENDING status"
            );
        }


        // Settlement must not take too long
        Instant settlementTime =
                transaction.getUpdatedAt();

        if (settlementTime == null ||
                settlementTime.isBefore(
                        Instant.now()
                                .minus(30, ChronoUnit.MINUTES))) {

            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.SETTLEMENT_EXPIRED,
                    "Settlement has exceeded the allowed time"
            );
        }


        // Merchant must still be active
        Merchant merchant =
                merchantRepository
                        .findById(transaction.getMerchantId())
                        .orElseThrow(
                                () -> new MerchantNotFoundException(
                                        "Merchant not found!"
                                )
                        );

        if (merchant.getMerchantStatus()
                != MerchantStatus.ACTIVE) {

            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.MERCHANT_SUSPENDED,
                    "Merchant account is not active"
            );
        }


        // Settlement amount must not exceed 100000
        if (transaction.getAmount()
                .compareTo(new BigDecimal("100000")) > 0) {

            return riskEvaluationService.saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.SETTLEMENT_AMOUNT_LIMIT,
                    "Settlement amount exceeds 100000"
            );
        }


        // Everything passed
        return riskEvaluationService.saveResult(
                transaction.getId(),
                true,
                null,
                "Settlement can be completed"
        );
    }
}