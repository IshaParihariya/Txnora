package com.example.txnora.enums

/**
 * to get the risk level of the merchant
 * basically for the risk service
 */
enum class MerchantRiskLevel
{
    LOW,
    MEDIUM, //for this level we will tell user this mercahnt is suspicious
    HIGH
}