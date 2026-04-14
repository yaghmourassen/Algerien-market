package com.example.ecom.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cartm {

    @Id
    private String id;

    // صاحب الكارت
    @DBRef
    private Userm user;

    // المنتجات في الكارت
    @DBRef
    private List<Productm> products = new ArrayList<>();

    private List<Integer> quantities = new ArrayList<>(); // كمية كل منتج مطابق للفهرس

    private double subtotal;
    private double shipping = 10.0;
    private double total;

    // Constructors
    public Cartm() {}

    public Cartm(Userm user) {
        this.user = user;
    }

    // حساب الإجمالي
    public void calculateTotals() {
        subtotal = 0;
        for (int i = 0; i < products.size(); i++) {
            subtotal += products.get(i).getPrice() * quantities.get(i);
        }
        total = subtotal + shipping;
    }

    // إضافة منتج
    public void addProduct(Productm product, int quantity) {
        products.add(product);
        quantities.add(quantity);
        calculateTotals();
    }

    // حذف منتج
    public void removeProduct(String productId) {
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getId().equals(productId)) {
                products.remove(i);
                quantities.remove(i);
                break;
            }
        }
        calculateTotals();
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Userm getUser() { return user; }
    public void setUser(Userm user) { this.user = user; }

    public List<Productm> getProducts() { return products; }
    public void setProducts(List<Productm> products) { this.products = products; }

    public List<Integer> getQuantities() { return quantities; }
    public void setQuantities(List<Integer> quantities) { this.quantities = quantities; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getShipping() { return shipping; }
    public void setShipping(double shipping) { this.shipping = shipping; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
}
