package com.example.txnora.service;

import com.example.txnora.event.TransactionCreatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
/**
 * TransactionEventProducer = person putting the message into Kafka
 * Sends a TransactionCreatedEvent to the transaction-created topic.
 */


//IMPORTANT :
    /*
    -> kafka does NOT understands java objects
    -> it does not understands TransactionCreatedEvent here
    -> it does NOT understands JSON
    -> KAFKA ONLY UNDERSTANDS BYTES**
    -> JSON is simply a format we choose to represent our structured data before turning it into bytes
    -> The serializer/deserializer is what makes our Java application and Kafka communicate.
     */
@Service
public class TransactionEventProducer {

                                //key   //value
    private final KafkaTemplate<String,TransactionCreatedEvent > kafkaTemplate;

    public TransactionEventProducer(KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishTransactionCreated(TransactionCreatedEvent transactionCreatedEvent) {
        // transaction-created -> topic
        //  from PRODUCER -> TransactionEventConsumer -> TransactionWorkflowService > RiskService
        kafkaTemplate.send("transaction-created", transactionCreatedEvent);
    }
}