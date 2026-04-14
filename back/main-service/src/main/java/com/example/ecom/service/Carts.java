package com.example.ecom.service;

import com.example.ecom.model.Cartm;
import com.example.ecom.model.Productm;
import com.example.ecom.model.Userm;
import com.example.ecom.repository.Cartr;
import com.example.ecom.repository.Productr;
import com.example.ecom.repository.Userr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class Carts {

    @Autowired
    private Cartr cartRepository;

    @Autowired
    private Userr userRepository;

    @Autowired
    private Productr productRepository;

    // إنشاء كارت جديد لمستخدم
    public Optional<Cartm> createCartForUser(String userId) {
        Optional<Userm> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Optional.empty();

        Cartm cart = new Cartm(userOpt.get());
        cartRepository.save(cart);
        return Optional.of(cart);
    }

    // جلب كارت مستخدم
    public Optional<Cartm> getCartByUserId(String userId) {
        return cartRepository.findByUser_Id(userId);
    }

    // إضافة منتج للكارت
    public Optional<Cartm> addProduct(String cartId, String productId, int quantity) {
        Optional<Cartm> cartOpt = cartRepository.findById(cartId);
        Optional<Productm> productOpt = productRepository.findById(productId);

        if (cartOpt.isEmpty() || productOpt.isEmpty()) return Optional.empty();

        Cartm cart = cartOpt.get();
        cart.addProduct(productOpt.get(), quantity);
        cartRepository.save(cart);
        return Optional.of(cart);
    }

    // إزالة منتج من الكارت
    public Optional<Cartm> removeProduct(String cartId, String productId) {
        Optional<Cartm> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) return Optional.empty();

        Cartm cart = cartOpt.get();
        cart.removeProduct(productId);
        cartRepository.save(cart);
        return Optional.of(cart);
    }

    // تحديث كمية منتج
    public Optional<Cartm> updateProductQuantity(String cartId, String productId, int quantity) {
        Optional<Cartm> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) return Optional.empty();

        Cartm cart = cartOpt.get();
        for (int i = 0; i < cart.getProducts().size(); i++) {
            if (cart.getProducts().get(i).getId().equals(productId)) {
                cart.getQuantities().set(i, quantity);
                break;
            }
        }
        cart.calculateTotals();
        cartRepository.save(cart);
        return Optional.of(cart);
    }
}
