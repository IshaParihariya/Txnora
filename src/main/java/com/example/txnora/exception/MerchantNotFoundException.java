package com.example.txnora.exception;

/**
 * when merchant not found exception so it will not retry in DTL
 * child class
 */
public class MerchantNotFoundException extends NonRetryableException
{
    public MerchantNotFoundException(String message) {
        super(message);
    }
}
