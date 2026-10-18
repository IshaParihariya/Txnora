package com.example.txnora.controller;

import com.example.txnora.dto.TransactionInvestigation;
import com.example.txnora.service.InvestigationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investigations")
@Slf4j
public class InvestigationController {

    private final InvestigationService investigationService;

    public InvestigationController(
            InvestigationService investigationService) {
        this.investigationService = investigationService;
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionInvestigation> investigate(
            @PathVariable String transactionId) {

        log.info("inside investigate");

        TransactionInvestigation investigation =
                investigationService.investigate(transactionId);

        return ResponseEntity.ok(investigation);
    }
}