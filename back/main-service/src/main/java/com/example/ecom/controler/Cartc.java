package com.example.ecom.controler;

import com.example.ecom.model.Cartm;
import com.example.ecom.model.Productm;
import com.example.ecom.model.Userm;
import com.example.ecom.repository.Cartr;
import com.example.ecom.repository.Productr;
import com.example.ecom.repository.Userr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class Cartc {

    @Autowired
    private Cartr cartRepository;

    @Autowired
    private Userr userRepository;

    @Autowired
    private Productr productRepository;

    // ✅ الحصول على كارت مستخدم معين
    @GetMapping("/{userId}")
    public ResponseEntity<Cartm> getOrCreateCart(@PathVariable String userId) {

        Optional<Cartm> cartOpt = cartRepository.findByUser_Id(userId);

        if (cartOpt.isPresent()) {
            return ResponseEntity.ok(cartOpt.get());
        }

        // إذا لم توجد سلة → تحقق أن المستخدم موجود
        Optional<Userm> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // إنشاء سلة جديدة
        Cartm newCart = new Cartm(userOpt.get());
        cartRepository.save(newCart);

        return ResponseEntity.ok(newCart);
    }

    // ✅ إنشاء كارت جديد لمستخدم
    @PostMapping("/create/{userId}")
    public ResponseEntity<Cartm> createCart(@PathVariable String userId) {
        Optional<Userm> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();

        Cartm cart = new Cartm(userOpt.get());
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    // ✅ إضافة منتج للكارت
    @PostMapping("/{cartId}/add/{productId}/{quantity}")
    public ResponseEntity<Cartm> addProductToCart(
            @PathVariable String cartId,
            @PathVariable String productId,
            @PathVariable int quantity
    ) {
        Optional<Cartm> cartOpt = cartRepository.findById(cartId);
        Optional<Productm> productOpt = productRepository.findById(productId);

        if (cartOpt.isEmpty() || productOpt.isEmpty()) return ResponseEntity.badRequest().build();

        Cartm cart = cartOpt.get();
        cart.addProduct(productOpt.get(), quantity);
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    // ✅ إزالة منتج من الكارت
    @DeleteMapping("/{cartId}/remove/{productId}")
    public ResponseEntity<Cartm> removeProductFromCart(
            @PathVariable String cartId,
            @PathVariable String productId
    ) {
        Optional<Cartm> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) return ResponseEntity.badRequest().build();

        Cartm cart = cartOpt.get();
        cart.removeProduct(productId);
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

    // ✅ تحديث كمية منتج في الكارت
    @PutMapping("/{cartId}/update/{productId}/{quantity}")
    public ResponseEntity<Cartm> updateProductQuantity(
            @PathVariable String cartId,
            @PathVariable String productId,
            @PathVariable int quantity
    ) {
        Optional<Cartm> cartOpt = cartRepository.findById(cartId);
        if (cartOpt.isEmpty()) return ResponseEntity.badRequest().build();

        Cartm cart = cartOpt.get();
        for (int i = 0; i < cart.getProducts().size(); i++) {
            if (cart.getProducts().get(i).getId().equals(productId)) {
                cart.getQuantities().set(i, quantity);
                break;
            }
        }
        cart.calculateTotals();
        cartRepository.save(cart);
        return ResponseEntity.ok(cart);
    }

}
