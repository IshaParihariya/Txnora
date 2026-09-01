package com.example.txnora.service;

import com.example.txnora.dto.CreateTransactionRequest;
import com.example.txnora.model.Transaction;
import com.example.txnora.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TransactionService
{
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction createTransactionService(CreateTransactionRequest request)
    {
        //validation is done already

        Transaction transaction=new Transaction();

        //here we are having this info from dto
        //but Transaction doesn't have it yet (model)
        //so in order to save it in the database
        //we are doing this all
        transaction.setUserId(request.getUserId());
        transaction.setMerchantId(request.getMerchantId());
        transaction.setAmount(request.getAmount());
        transaction.setCurrency(request.getCurrency());

        //status initiated
        transaction.setStatus("INITIATED");

        transaction.setCreatedAt(Instant.now());
        //we will change the UpdatedAt later..
        transaction.setUpdatedAt(Instant.now());

        //the save() method is already provided by Spring Data MongoDB
        //because our repository will extend MongoRepository
        return transactionRepository.save(transaction);
    }

    public Transaction getTransactionService(String id)
    {
        //findById() returns Optional<Transaction>
        // if transaction is not present, throw exception
        return transactionRepository.findById(id).orElseThrow(()-> new RuntimeException("Transaction not found!"));
    }

    public List<Transaction> getAllTransactionService()
    {
        return transactionRepository.findAll();
    }

    public List<Transaction> findByUserIdService(String userId)
    {
        return transactionRepository.findAllByUserId(userId);
    }


}
