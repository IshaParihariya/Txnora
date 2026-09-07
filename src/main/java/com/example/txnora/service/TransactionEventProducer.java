package com.example.txnora.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
/**
 * TransactionEventProducer = person putting the message into Kafka
 * Kafka, please put this transactionId into the transaction-created topic.
 * Producer sends the ID to Kafka
 */

@Service
public class TransactionEventProducer {

                                //key   //value
    private final KafkaTemplate<String, String> kafkaTemplate;

    public TransactionEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishTransactionCreated(String  transactionId) {
        // transaction-created -> topic
        //  from PRODUCER -> TransactionEventConsumer -> TransactionWorkflowService > RiskService
        kafkaTemplate.send("transaction-created",  transactionId);
    }
}