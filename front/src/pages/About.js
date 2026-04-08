import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/about.css";

export default function About() {
  return (
    <>
      <Header />

      <main className="about-page">
        <div className="container text-center py-5">
          <h1 className="about-title">About Nassim-Store</h1>
          <p className="about-text">
            Welcome to Nassim-Store! We are dedicated to providing the best
            online shopping experience with high-quality products and
            excellent customer service.
          </p>
          <p className="about-text">
            Our mission is to make shopping easy, fast, and enjoyable for
            everyone. Thank you for choosing Nassim-Store!
          </p>

          {/* هنا نضيف الخريطة */}
<div className="map-container my-4">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d201.42493620291606!2d6.784753939410545!3d36.12275485178592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDA3JzIyLjAiTiA2wrA0NycwNS4yIkU!5e0!3m2!1sfr!2sdz!4v1768944393552!5m2!1sfr!2sdz"
    width="50%"       // يجعل الخريطة متجاوبة مع أي شاشة
    height="450"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Nassim Store Location"
  />
</div>








        </div>
      </main>

      <Footer />
    </>
  );
}
