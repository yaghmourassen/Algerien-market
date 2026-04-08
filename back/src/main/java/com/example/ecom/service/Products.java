package com.example.ecom.service;

import com.example.ecom.model.Productm;
import com.example.ecom.repository.Productr;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;

@Service
public class Products {

    private final Productr productRepository;

    public Products(Productr productRepository) {
        this.productRepository = productRepository;
    }

    // ✅ Get all products
    public List<Productm> getAllProducts() {
        return productRepository.findAll();
    }

    // ✅ Get product by ID
    public Optional<Productm> getProductById(String id) {
        return productRepository.findById(id);
    }

    // ✅ Check if product exists
    public boolean existsById(String id) {
        return productRepository.existsById(id);
    }

    // ✅ Delete product
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    // ✅ Create product with file upload
    public Productm createProduct(String name, String description, double price,
                                  String category, MultipartFile imageFile) throws IOException {

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imageUrl = saveImage(imageFile);
        }

        Productm product = new Productm(name, description, price, imageUrl, category);
        return productRepository.save(product);
    }

    // ✅ Update product with optional file upload
    public Optional<Productm> updateProduct(String id, String name, String description,
                                            double price, String category,
                                            MultipartFile imageFile) throws IOException {

        return productRepository.findById(id).map(existing -> {

            existing.setName(name);
            existing.setDescription(description);
            existing.setPrice(price);
            existing.setCategory(category);

            try {
                if (imageFile != null && !imageFile.isEmpty()) {
                    String imageUrl = saveImage(imageFile);
                    existing.setImageUrl(imageUrl);
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image");
            }

            return productRepository.save(existing);
        });
    }

    // 🔹 Helper method to save image to disk
    private String saveImage(MultipartFile imageFile) throws IOException {
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));

        String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.write(filePath, imageFile.getBytes());

        return "http://localhost:8080/uploads/" + fileName;
    }
}