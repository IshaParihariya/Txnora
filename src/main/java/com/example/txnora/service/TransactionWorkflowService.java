package com.example.txnora.service;

import com.example.txnora.enums.TransactionStatus;
import com.example.txnora.model.Transaction;
import org.springframework.stereotype.Service;

/**
 * this is for the processing of the transaction and further lifecycles
 * to trigger the transaction lifecycles..
 */
@Service
public class TransactionWorkflowService
{
    private final TransactionService transactionService;
    private final RiskService riskService;

    public TransactionWorkflowService(TransactionService transactionService, RiskService riskService)
    {
        this.transactionService=transactionService;
        this.riskService = riskService;
    }

    public void processTransaction(String id)
    {
        //start the processing
        Transaction transaction =transactionService.startProcessing(id);
        //logic about transaction before authorising
        //risks are all checked

        //if risky then stop there => FAILED
        if(riskService.isRisky(transaction))
        {
            transactionService.changeStatus(id, TransactionStatus.FAILED);
            return;
        }

        //if not risky it will be authorized
        transaction=transactionService.authorizeTransaction(id);

        //authorisation we will again check all these
        // autho is still valid
        //merchant is still active
        //settlement hasn't been altered
        //transaction is eligible
        if(!riskService.isEligibleForSettlement(transaction))
        {
            transactionService.changeStatus(id, TransactionStatus.FAILED);
            return;
        }

        transaction=transactionService.startSettlement(id);

        //for safety again conditions
        if (!riskService.canCompleteSettlement(transaction))
        {
            transactionService.changeStatus(id, TransactionStatus.FAILED);
            return;
        }

        //settlement logic
        transactionService.completeSettlement(id);
    }
}
