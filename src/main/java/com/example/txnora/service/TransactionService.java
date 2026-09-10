package com.example.txnora.service;

import com.example.txnora.dto.CreateTransactionRequest;
import com.example.txnora.enums.TransactionStatus;
import com.example.txnora.event.TransactionCreatedEvent;
import com.example.txnora.exception.InvalidTransactionStatusException;
import com.example.txnora.model.Transaction;
import com.example.txnora.repository.MerchantRepository;
import com.example.txnora.repository.TransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * transactions created then
 * TransactionWorkFlowService class
 * there the flow is continued
 */
@Slf4j
@Service
public class TransactionService
{
    private final TransactionRepository transactionRepository;
    //KAFKA
    private final TransactionEventProducer eventProducer;

    //merchant repo
    private final MerchantRepository merchantRepository;

    public TransactionService(TransactionRepository transactionRepository, TransactionEventProducer eventProducer, MerchantRepository merchantRepository) {
        this.transactionRepository = transactionRepository;
        this.eventProducer = eventProducer;

        this.merchantRepository = merchantRepository;
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
        transaction.setStatus(TransactionStatus.INITIATED);

        transaction.setCreatedAt(Instant.now());
        //we will change the UpdatedAt later..
        transaction.setUpdatedAt(Instant.now());

        //the save() method is already provided by Spring Data MongoDB
        //because our repository will extend MongoRepository

        // saving first here bro
        Transaction savedTransaction = transactionRepository.save(transaction);


        //KAFKA
        //passing this info to Kafka from TransactionCreatedEvent
        //object created here cuz we need new event for each new transaction
        TransactionCreatedEvent event =new TransactionCreatedEvent();

        event.transactionId = savedTransaction.getId();
        event.userId = savedTransaction.getUserId();
        event.merchantId = savedTransaction.getMerchantId();
        event.amount = savedTransaction.getAmount();
        event.currency = savedTransaction.getCurrency();
       eventProducer.publishTransactionCreated(event);

        return savedTransaction;

    }

    public Transaction getTransactionService(String id)
    {
        //findById() returns Optional<Transaction>
        //if transaction is not present, throw exception
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

    //changing status transition
    public Transaction changeStatus(String id,TransactionStatus nextStatus)
    {
        //debugging
        log.info("inside change status method for authorisation");

        //if transaction not found then throw exception
        //we will later on do global exceptions
        Transaction transaction=transactionRepository.findById(id)
               .orElseThrow(()-> new RuntimeException("Transaction not found!"));

        //debuggind
        log.info("transaction found : "+ id);

        TransactionStatus currentStatus=transaction.getStatus();

        log.info("status of the transaction found  {}", currentStatus);

        //now lets validate like if next status is allowed for this current one..
        if(!statusIsAllowed(currentStatus,nextStatus))
        {
            // after failed -> process NOT ALLOWED
            // after settlement -> no process allowed
            // apart from that all are allowed
            // but no status need to be skipped
            throw new InvalidTransactionStatusException("Invalid transaction status transition!");
        }

        //debugging
        log.info("after status is alllowed");

        //if status validation is all gud
        //then change the status
        transaction.setStatus(nextStatus);
        //updated at what Instant
        transaction.setUpdatedAt(Instant.now());

        //saving this status now
        //but here if we saving this then mongodb will not have the older data so
        //we will work on the history later now
        //rn we just gonn' get this part done..
        return transactionRepository.save(transaction);

    }




    private boolean statusIsAllowed(TransactionStatus currentStatus,TransactionStatus nextStatus)
    {
        //debugging
        log.info("in statusIsAllowed method");

        if (currentStatus == TransactionStatus.INITIATED)
        {
            return nextStatus == TransactionStatus.PROCESSING;
        }

        if (currentStatus == TransactionStatus.PROCESSING)
        {
            return nextStatus == TransactionStatus.AUTHORIZED
                    || nextStatus == TransactionStatus.FAILED;
        }

        if (currentStatus == TransactionStatus.AUTHORIZED)
        {
            return nextStatus == TransactionStatus.SETTLEMENT_PENDING
                    || nextStatus == TransactionStatus.FAILED;
        }

        if (currentStatus == TransactionStatus.SETTLEMENT_PENDING)
        {
            return nextStatus == TransactionStatus.SETTLED
                    || nextStatus == TransactionStatus.FAILED;
        }

        //debugging
        log.info("failed in statusIsAllowed");


        // SETTLED and FAILED are terminal states
        return false;
    }

    public Transaction startProcessing(String id)
    {
        return changeStatus(id, TransactionStatus.PROCESSING);
    }

    public Transaction authorizeTransaction(String id)
    {
        log.info("inside authorizeTransaction method in TransactionService");
        return changeStatus(id, TransactionStatus.AUTHORIZED);
    }

    public Transaction startSettlement(String id)
    {
        return changeStatus(id, TransactionStatus.SETTLEMENT_PENDING);
    }

    public Transaction completeSettlement(String id)
    {
        return changeStatus(id, TransactionStatus.SETTLED);
    }

}
