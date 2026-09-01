package com.example.txnora.repository;

import com.example.txnora.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

//<Transaction,String> => what we store and type of Id
public interface TransactionRepository extends MongoRepository<Transaction,String>
{
    //findByUserId here spring knows what userId is
    //so didn't hafta write logic and shit
    public List<Transaction> findAllByUserId(String userId);
}
