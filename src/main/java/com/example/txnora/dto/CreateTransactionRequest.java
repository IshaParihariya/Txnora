package com.example.txnora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

//our client is only allowed to send these
//we created this separately bcuz only this info we need to get from the client..
//validation also done here now logical stuff in the Service

public class CreateTransactionRequest
{


    @NotBlank
    public String userId; //userId

    @NotBlank
    public String merchantId; //receiver Id

    @NotNull
    @Positive
    public BigDecimal amount; //amount transferred


    @NotBlank
    public String currency; //currency like INR

    //getters setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }


    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }

    //toString method

    @Override
    public String toString() {
        return "CreateTransactionRequest{" +
                "userId='" + userId + '\'' +
                ", merchantId='" + merchantId + '\'' +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                '}';
    }

}
