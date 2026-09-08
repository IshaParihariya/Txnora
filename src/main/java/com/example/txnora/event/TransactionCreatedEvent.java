package com.example.txnora.event;

import java.math.BigDecimal;

/**
 * Carries information about a transaction that has already been created,
 * so we can send that information to Kafka.
 */
public class TransactionCreatedEvent {

    public String transactionId;
    public String userId;
    public String merchantId;
    public BigDecimal amount;
    public String currency;
}