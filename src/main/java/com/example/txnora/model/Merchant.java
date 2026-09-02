package com.example.txnora.model;

import com.example.txnora.enums.MerchantRiskLevel;
import com.example.txnora.enums.MerchantStatus;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * merchant info for risk related stuff in the db
 */
@Document(collection = "merchants")
public class Merchant
{

    @NotBlank
    @Id
    private String id;

    @NotBlank
    private String merchantName;

    private MerchantRiskLevel merchantRiskLevel;

    private MerchantStatus merchantStatus;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public MerchantRiskLevel getMerchantRiskLevel() {
        return merchantRiskLevel;
    }

    public void setMerchantRiskLevel(MerchantRiskLevel merchantRiskLevel) {
        this.merchantRiskLevel = merchantRiskLevel;
    }

    public MerchantStatus getMerchantStatus() {
        return merchantStatus;
    }

    public void setMerchantStatus(MerchantStatus merchantStatus) {
        this.merchantStatus = merchantStatus;
    }

    @Override
    public String toString() {
        return "Merchant{" +
                "id='" + id + '\'' +
                ", merchantName='" + merchantName + '\'' +
                ", merchantRiskLevel=" + merchantRiskLevel +
                ", merchantStatus=" + merchantStatus +
                '}';
    }

}
