package com.example.txnora.repository;

import com.example.txnora.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * in order to save the users in the db
 */
@Repository
public interface UserRepository extends MongoRepository<User,String>
{
    Optional<User> findByEmail(String email);
}
