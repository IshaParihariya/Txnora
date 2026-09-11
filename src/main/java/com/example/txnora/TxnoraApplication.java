package com.example.txnora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka  //explicitly added this here cuz we were having problems
@SpringBootApplication
public class TxnoraApplication {

    public static void main(String[] args) {
        SpringApplication.run(TxnoraApplication.class, args);
    }

}
