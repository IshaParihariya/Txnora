package com.example.txnora.controller;

import com.example.txnora.dto.CreateTransactionRequest;
import com.example.txnora.model.Transaction;
import com.example.txnora.service.TransactionService;
import com.example.txnora.service.TransactionWorkflowService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TransactionController
{
    private final TransactionService transactionService;
    private final TransactionWorkflowService transactionWorkflowService;


    //constructor injection
    public TransactionController(TransactionService transactionService, TransactionWorkflowService transactionWorkflowService)
    {
        this.transactionService=transactionService;
        this.transactionWorkflowService = transactionWorkflowService;
    }

    @PostMapping("/transactions")
    //@Valid =>> Run the validation rules on this request before giving it to my method
    public Transaction createTransaction(@Valid @RequestBody CreateTransactionRequest request)
    {
        Transaction transaction =
                transactionService.createTransactionService(request);

        // Backend starts the transaction workflow
        //WE WANT TO WORK WITH KAFKA HERE
        transactionWorkflowService.processTransaction(transaction.getId());

        return transactionService.createTransactionService(request);
    }

    @GetMapping("transactions/{id}")
    public Transaction getTransaction(@PathVariable String id)
    {
        return transactionService.getTransactionService(id);
    }

    //get all transactions
    //we will work on this when spring security will come
    //as this need to be role based..
    @GetMapping("/transactions")
    public List<Transaction> getAllTransaction()
    {
        return transactionService.getAllTransactionService();
    }

    @GetMapping("transactions/user/{userId}")
    public List<Transaction> findByUserId(@PathVariable String userId)
    {
        return transactionService.findByUserIdService(userId);
    }
}
