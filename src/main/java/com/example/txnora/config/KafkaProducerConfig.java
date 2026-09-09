package com.example.txnora.config;

import com.example.txnora.event.TransactionCreatedEvent;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
//Json serializer
import org.springframework.kafka.support.serializer.JacksonJsonSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * serializer as kafka understands only bytes
 *  TransactionCreatedEvent -> JSON -> bytes
 *
 *
 *  KafkaProducerConfig = "How should my Kafka Producer behave?"
 *
 * TransactionEventProducer = "What event do I want to send?"
 */
@Configuration
public class KafkaProducerConfig {

    @Bean
    public ProducerFactory<String, TransactionCreatedEvent> producerFactory() {

        Map<String, Object> config = new HashMap<>();

        config.put(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
                "localhost:9092"
        );

        config.put(
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class
        );

        //as initially i passed only transaction id so string serialiser is here
        //now i am doing with JSON so we need json serialiser
        /*config.put(
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                StringSerializer.class
        );*/

        //json serialiser
        config.put(
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                JacksonJsonSerializer.class
        );


        //PRODUCER RETRY
        config.put(ProducerConfig.RETRIES_CONFIG, 3); //3 RETRIES
        config.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 1000); //WAIT 1 SECOUND AFTER EACH FAIL
        config.put(ProducerConfig.ACKS_CONFIG, "all"); //ACK for producer that its success!

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String,TransactionCreatedEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}