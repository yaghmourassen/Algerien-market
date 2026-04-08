package com.example.ecom.repository;

import com.example.ecom.model.Productm;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface Productr extends MongoRepository<Productm, String> {
}
