package com.example.ecom.repository;

import com.example.ecom.model.Cartm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Cartr extends MongoRepository<Cartm, String> {

    // إيجاد كارت حسب معرف المستخدم
    Optional<Cartm> findByUser_Id(String userId);

}