package com.example.txnora.exception;

/**
 * in DTL exceptions which should not be retried
 * parent class
 */
public class NonRetryableException extends RuntimeException
{
    public NonRetryableException(String message)
    {
        super(message);
    }
}
