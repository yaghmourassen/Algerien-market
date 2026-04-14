package com.example.ecom.repository;

import com.example.ecom.model.Userm;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface Userr extends MongoRepository<Userm, String> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Userm findByEmail(String email); // ✅ returns Userm, not Optional
}