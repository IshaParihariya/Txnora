package com.example.txnora.repository;

import com.example.txnora.model.Merchant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public class MerchantRepository extends MongoRepository<Merchant, String> {
}
