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

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String,TransactionCreatedEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}