package com.example.txnora.config;

import com.example.txnora.event.TransactionCreatedEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

/**
 * deserializer JSON -> object
 */
@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, TransactionCreatedEvent> consumerFactory() {

        Map<String, Object> config = new HashMap<>();

        config.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ConsumerConfig.GROUP_ID_CONFIG,
                "txnora-workflow-group"
        );

        config.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class
        );


        config.put(
                ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,
                "earliest"
        );

        //we clearly mentioned that we need to deserialize this Json into this object
        JacksonJsonDeserializer<TransactionCreatedEvent> deserializer =
                new JacksonJsonDeserializer<>(TransactionCreatedEvent.class);
        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );

    }

    //listener
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TransactionCreatedEvent>
    kafkaListenerContainerFactory(KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate) {

        ConcurrentKafkaListenerContainerFactory<String, TransactionCreatedEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory());


        //CONSUMER RETRY
        //backoff means after this again try to process it
        //here 2000L means after 2 sec retry
        //3L means number of attempts after initial fail
        DefaultErrorHandler errorHandler =
                new DefaultErrorHandler(
                        //recovery strategy after retries fail
                        deadLetterPublishingRecoverer(kafkaTemplate),
                        //but before that do this
                        new FixedBackOff(2000L, 3L));

        factory.setCommonErrorHandler(errorHandler);

        return factory;
    }

    //DLT : dead letter topic
    //DLQ : dead letter queue
    //after all consumer retries are exhausted and the event still cannot be processed successfully
    //and still the transaction is not processing
    //we will store it in the transaction-created.DLT
    //and this will be published by KafkaTemplate
    //and later on will see why it's not processing and all..
    @Bean
    public DeadLetterPublishingRecoverer deadLetterPublishingRecoverer(KafkaTemplate<String,TransactionCreatedEvent> kafkaTemplate)
    {
        return new DeadLetterPublishingRecoverer(kafkaTemplate);
    }

}