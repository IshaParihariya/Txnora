package com.example.txnora.model;

import com.example.txnora.enums.RiskRule;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * later on for investigation purpose we would need to know
 * the exact reason why our transaction failed
 */

@Document(collection = "risk_evaluation_results")
public class RiskEvaluationResult
{
    @Id
    private String id;
    private String transactionId;
    private boolean approved;
    private RiskRule rule;
    private String reason;

    public RiskEvaluationResult(
            boolean approved,
            RiskRule rule,
            String reason) {
        this.approved = approved;
        this.rule = rule;
        this.reason = reason;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setRule(RiskRule rule) {
        this.rule = rule;
    }

    public RiskRule getRule() {
        return rule;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "RiskEvaluationResult{" +
                "approved=" + approved +
                ", rule=" + rule +
                ", id =" + id +
                ", transactionId =" + transactionId +
                ", reason='" + reason + '\'' +
                '}';
    }

}