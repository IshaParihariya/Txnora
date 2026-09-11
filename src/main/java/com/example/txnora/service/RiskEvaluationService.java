package com.example.txnora.service;

import com.example.txnora.enums.MerchantRiskLevel;
import com.example.txnora.enums.MerchantStatus;
import com.example.txnora.enums.RiskRule;
import com.example.txnora.exception.MerchantNotFoundException;
import com.example.txnora.model.Merchant;
import com.example.txnora.model.RiskEvaluationResult;
import com.example.txnora.model.Transaction;
import com.example.txnora.repository.MerchantRepository;
import com.example.txnora.repository.RiskEvaluationResultRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Set;

/**
 * for investigation purpose
 */
@Slf4j
@Service
public class RiskEvaluationService
{
    private final MerchantRepository merchantRepository;

    private final RiskEvaluationResultRepository riskEvaluationResultRepository;

    public RiskEvaluationService(MerchantRepository merchantRepository, RiskEvaluationResultRepository riskEvaluationResultRepository) {
        this.merchantRepository = merchantRepository;
        this.riskEvaluationResultRepository = riskEvaluationResultRepository;
    }
    //only these currencies we are allowing for now
    private static final Set<String> SUPPORTED_CURRENCIES =
            Set.of("INR", "USD", "EUR", "GBP");

    public RiskEvaluationResult riskEvaluation(Transaction transaction)
    {
        // debugging
        log.info("in riskEvaluation method");

        // Compare the transaction amount with 100000.
        if (transaction.getAmount().compareTo(new BigDecimal(100000)) > 0)
        {
            log.warn("Transaction amount is too high! : {}", transaction.getAmount());

            return saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.AMOUNT_LIMIT,
                    "Transaction amount exceeds 100000"
            );
        }

        // debugging
        log.info("Looking for merchant: {}", transaction.getMerchantId());

        // merchant might be suspicious
        Merchant merchant = merchantRepository.findById(transaction.getMerchantId())
                .orElseThrow(() -> new MerchantNotFoundException("Merchant not found!"));

        // debugging
        log.info("Merchant found: {}", merchant.getId());

        //risk level of merchant
        if (merchant.getMerchantRiskLevel() != MerchantRiskLevel.LOW)
        {
            log.warn("Merchant is suspicious! : {}", merchant.getId());

            return saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.MERCHANT_RISK,
                    "Merchant is classified as suspicious"
            );
        }


        // Suspended merchant
        if (merchant.getMerchantStatus() == MerchantStatus.SUSPENDED)
        {
            log.warn("Merchant is suspended! : {}", merchant.getId());

            return saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.MERCHANT_SUSPENDED,
                    "Merchant account is suspended"
            );
        }


        // Currency not supported
        if (!SUPPORTED_CURRENCIES.contains(transaction.getCurrency()))
        {
            log.warn("Unsupported currency: {}", transaction.getCurrency());

            return saveResult(
                    transaction.getId(),
                    false,
                    RiskRule.UNSUPPORTED_CURRENCY,
                    "Unsupported currency"
            );
        }


        // debugging
        log.info("RISK CHECK PASSED for transaction: {}", transaction.getId());

        // More risks are left; will cover them later.
        return saveResult(
                transaction.getId(),
                true,
                null,
                "All risk evaluation done!"
        );
    }


    //one place to save all risks results int he db
    public RiskEvaluationResult saveResult(
            String transactionId,
            boolean approved,
            RiskRule rule,
            String reason) {

        RiskEvaluationResult result =
                new RiskEvaluationResult(
                        approved,
                        rule,
                        reason
                );

        result.setTransactionId(transactionId);

        riskEvaluationResultRepository.save(result);

        return result;
    }
}
