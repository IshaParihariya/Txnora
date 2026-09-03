package com.example.txnora.repository;

import com.example.txnora.model.Merchant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MerchantRepository extends MongoRepository<Merchant, String> {
}
