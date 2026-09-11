package com.example.txnora.enums;

/**
 * some fixed risks that we are having in our business logic
 * for further being used in RiskEvaluationResult
 * for investigation purpose
 */
public enum RiskRule
{
    AMOUNT_LIMIT,
    MERCHANT_RISK,
    MERCHANT_SUSPENDED,
    UNSUPPORTED_CURRENCY,

    INVALID_TRANSACTION_STATUS,
    AUTHORIZATION_EXPIRED,
    SETTLEMENT_AMOUNT_LIMIT,

    SETTLEMENT_EXPIRED
}
