package com.example.txnora.service;

import com.example.txnora.event.TransactionCreatedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

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
@Slf4j
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

        //here send() return CompletableFuture
        // after status=initiated and saved in MongoDB
        //what if kafka fails due to some reason??
        //what if this send() fils in some way
        //so we are getting the return and tryna do failur/success check here..

        CompletableFuture<SendResult<String,TransactionCreatedEvent>> future= kafkaTemplate.send("transaction-created", transactionCreatedEvent);

        //first parameter  → result of the Future
        //second parameter → exception/error
        future.whenComplete((result,exception) ->
        {

            //error is exception is there ryt
            if(exception!=null)
            {
                log.error(
                        "Failed to publish transaction-created event for transaction: {}",
                        transactionCreatedEvent.transactionId,
                        exception
                );
            }
            else {
                log.info(
                        "Transaction-created event published successfully. transactionId={}, topic={}, partition={}, offset={}",
                        transactionCreatedEvent.transactionId,
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset()
                );
            }
        }); //end of whenComplete
    }
}