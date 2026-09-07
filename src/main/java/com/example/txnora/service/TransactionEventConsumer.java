package com.example.txnora.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * TransactionEventConsumer = person reading from Kafka
 */
@Slf4j
@Service
public class TransactionEventConsumer {

    private final TransactionWorkflowService workflowService;

    public TransactionEventConsumer(TransactionWorkflowService workflowService) {
        this.workflowService = workflowService;
        System.out.println("TransactionEventConsumer CREATED");
    }

    @KafkaListener(
            topics = "transaction-created",
            groupId = "txnora-workflow-group"
    )
    public void consumeTransactionCreated(String transactionId) {

        log.info("Received TransactionCreated event: " + transactionId);
        //System.out.println("Received TransactionCreated event: " + transactionId);

        workflowService.processTransaction(transactionId);
    }
}