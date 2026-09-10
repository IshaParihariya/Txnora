package com.example.txnora.exception;
/**
 * when status of transaction is invalid exception so it will not retry in DTL
 * child class
 */
public class InvalidTransactionStatusException extends NonRetryableException{

    public InvalidTransactionStatusException(String message)
    {
        super(message);
    }
}
