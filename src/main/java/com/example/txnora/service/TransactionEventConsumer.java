package com.example.txnora.service;

import com.example.txnora.event.TransactionCreatedEvent;
import com.example.txnora.model.ProcessedEvent;
import com.example.txnora.repository.ProcessedEventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

/**
 * TransactionEventConsumer = person reading from Kafka
 */
@Slf4j
@Service
public class TransactionEventConsumer {

    private final TransactionWorkflowService workflowService;

    private final ProcessedEventRepository processedEventRepository;

    public TransactionEventConsumer(TransactionWorkflowService workflowService, ProcessedEventRepository processedEventRepository) {
        this.workflowService = workflowService;
        this.processedEventRepository = processedEventRepository;
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

        //Idempotency issue
        //if id exists in the database in processed events then DO NOT CONTINUE
        //else continue
        if(processedEventRepository.existsById(event.eventId))
        {
            log.info(
                    "Event {} already processed. Skipping duplicate.",
                    event.eventId
            );

            return;
        }

        workflowService.processTransaction(event.transactionId);
        //after this if processing of the transaction has any exception then consumer
        //retries will happen
        //Kafka has the msg but couldn't process it

        //after processing saving in db
        ProcessedEvent processedEvent=new ProcessedEvent();

        processedEvent.setEventId(event.eventId);

        processedEvent.setProcessedAt(Instant.now());

        processedEventRepository.save(processedEvent);
    }
}