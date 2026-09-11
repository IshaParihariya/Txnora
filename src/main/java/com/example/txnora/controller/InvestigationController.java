package com.example.txnora.controller;

import com.example.txnora.dto.TransactionInvestigation;
import com.example.txnora.service.InvestigationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investigations")
public class InvestigationController {

    private final InvestigationService investigationService;

    public InvestigationController(
            InvestigationService investigationService) {
        this.investigationService = investigationService;
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionInvestigation> investigate(
            @PathVariable String transactionId) {

        TransactionInvestigation investigation =
                investigationService.investigate(transactionId);

        return ResponseEntity.ok(investigation);
    }
}