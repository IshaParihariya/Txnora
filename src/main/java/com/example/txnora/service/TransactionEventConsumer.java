package com.example.txnora.service;

import com.example.txnora.event.TransactionCreatedEvent;
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


    public void consumeTransactionCreated(TransactionCreatedEvent event) {

        log.info("Received TransactionCreated event: " + event.transactionId);
        //System.out.println("Received TransactionCreated event: " + transactionId);

        //temp testing
        //throw new RuntimeException("TEST DLT ERROR");

        workflowService.processTransaction(event.transactionId);
        //after this if processing of the transaction has any exception then consumer
        //retries will happen
        //Kafka has the msg but couldn't process it
    }
}