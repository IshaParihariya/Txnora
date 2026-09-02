package com.example.txnora.service;

import com.example.txnora.enums.MerchantRiskLevel;
import com.example.txnora.enums.MerchantStatus;
import com.example.txnora.enums.TransactionStatus;
import com.example.txnora.model.Merchant;
import com.example.txnora.model.Transaction;
import com.example.txnora.repository.MerchantRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;

/**
 * to do all risk analysis if there are no risks in authorising this particular transaction..
 * also adding after authorisation
 * and after setllement pending status the conditions in this only
 */
@Slf4j
@Service
public class RiskService
{
    private final MerchantRepository merchantRepository;

    public RiskService(MerchantRepository merchantRepository)
    {
        this.merchantRepository = merchantRepository;
    }

    //only these currencies we are allowing for now
    private static final Set<String> SUPPORTED_CURRENCIES =
            Set.of("INR", "USD", "EUR", "GBP");


    //before authorization
    public boolean isRisky(Transaction transaction)
    {
        //Compare the transaction amount with 100000.
        //If the result is greater than 0, the transaction amount is greater than 100000
        if(transaction.getAmount().compareTo(new BigDecimal(100000)) > 0)
        {

            log.warn("Transaction amount is too high! : {}", transaction.getAmount());
            return true;
        }

        //merchant or reciever might be suspicious
        Merchant merchant = merchantRepository.findById(transaction.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Merchant not found!"));

        if (merchant.getMerchantRiskLevel() != MerchantRiskLevel.LOW)
        {
            log.warn("Merchant is suspicious! : {}", merchant.getId());
            return true;
        }

        //Suspended merchant
        if (merchant.getMerchantStatus() == MerchantStatus.SUSPENDED)
        {
            log.warn("Merchant is suspended! : {}", merchant.getId());
            return true;
        }

        //currency not supported
        if (!SUPPORTED_CURRENCIES.contains(transaction.getCurrency()))
        {
            log.warn("Unsupported currency: {}", transaction.getCurrency());
            return true;
        }

        //more risks are left will cover them later..
        return false;
    }

    //after authorization
    public boolean isEligibleForSettlement(Transaction transaction)
    {
        // Transaction must be AUTHORIZED
        if (transaction.getStatus() != TransactionStatus.AUTHORIZED)
        {
            return false;
        }

        //  Authorization validity - 30 minutes
        Instant authorizationTime = transaction.getUpdatedAt();

        if (authorizationTime == null ||
                authorizationTime.isBefore(Instant.now().minus(30, ChronoUnit.MINUTES)))
        {
            return false;
        }

        // Merchant must still be active
        Merchant merchant = merchantRepository.findById(transaction.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Merchant not found!"));

        if (merchant.getMerchantStatus() != MerchantStatus.ACTIVE)
        {
            return false;
        }

        // Settlement amount must < 1,00,000
        if (transaction.getAmount().compareTo(new BigDecimal("100000"))>0)
        {
            return false;
        }

        return true;
    }

    //after settlement pending
    //for finally completing the settlement
    public boolean canCompleteSettlement(Transaction transaction)
    {
        // Must be in SETTLEMENT_PENDING
        if (transaction.getStatus() != TransactionStatus.SETTLEMENT_PENDING)
        {
            return false;
        }

        // Settlement must not take too long
        Instant settlementTime = transaction.getUpdatedAt();

        if (settlementTime.isBefore(
                Instant.now().minus(30, ChronoUnit.MINUTES)))
        {
            return false;
        }

        // Merchant must still be active
        Merchant merchant = merchantRepository.findById(transaction.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Merchant not found!"));

        if (merchant.getMerchantStatus() != MerchantStatus.ACTIVE)
        {
            return false;
        }

        // Settlement amount must < 1,00,000
        if (transaction.getAmount().compareTo(new BigDecimal("100000"))>0)
        {
            return false;
        }


        return true;
    }
}
