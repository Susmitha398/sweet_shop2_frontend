import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1605197584547-c93e1af73e87?w=1600&auto=format&fit=crop&q=85',
    eyebrow: 'ROYAL FESTIVE SPECIAL • PURE COW DESI GHEE',
    title: 'Legendary Indian Sweets, Delivered Fresh',
    description: 'Discover heritage Tirunelveli halwa, handmade laddus and rich kaju katli, prepared with traditional recipes.',
    href: '/category/alwa',
    action: 'Explore Royal Halwa'
  },
  {
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=1600&auto=format&fit=crop&q=85',
    eyebrow: 'HANDCRAFTED FOR EVERY CELEBRATION',
    title: 'Make Every Moment Sweeter',
    description: 'Share golden motichoor laddus and classic Indian treats with the people you love.',
    href: '/category/laddu',
    action: 'Shop Laddus'
  },
  {
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1600&auto=format&fit=crop&q=85',
    eyebrow: 'A LITTLE ROYALTY IN EVERY BOX',
    title: 'Discover Our Kaju & Dry Fruit Collection',
    description: 'Explore delicate cashew sweets and premium festive favourites, made for gifting and sharing.',
    href: '/category/kaju-dryfruit',
    action: 'Explore Kaju Sweets'
  }
];

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section
      className="hero-slider"
      aria-label="Featured sweets"
      aria-roledescription="carousel"
    >
      <div
        className="hero-slide-image"
        style={{ backgroundImage: `url("${slide.image}")` }}
        role="img"
        aria-label={slide.title}
      />
      <div className="hero-slide-shade" />
      <div className="hero-slide-content" key={activeSlide}>
        <span className="hero-slide-eyebrow">{slide.eyebrow}</span>
        <h1>{slide.title}</h1>
        <p>{slide.description}</p>
        <Link to={slide.href} className="hero-slide-action">{slide.action}<span aria-hidden="true"> →</span></Link>
      </div>
      <div className="hero-slide-controls" aria-label="Choose featured slide">
        {slides.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`hero-slide-dot${index === activeSlide ? ' active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Show slide ${index + 1}: ${item.title}`}
            aria-current={index === activeSlide ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  );
}
