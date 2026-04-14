package com.example.ecom.controler;

import com.example.ecom.model.Productm;
import com.example.ecom.repository.Productr;
import com.example.ecom.service.Products;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class Productc {

    private final Products service;

    public Productc(Products service) {
        this.service = service;
    }

    @GetMapping
    public List<Productm> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Productm> getProductById(@PathVariable String id) {
        return service.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Productm> addProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam String category,
            @RequestParam MultipartFile image
    ) throws IOException {

        Productm product = service.createProduct(name, description, price, category, image);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Productm> updateProduct(
            @PathVariable String id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam String category,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        return service.updateProduct(id, name, description, price, category, image)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}