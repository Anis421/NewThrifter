import React, { useRef } from 'react';
import './CategorySlider.css';
import categoryImages from './categoryImages';

const normalizeCategory = cat => {
  if (!cat) return '';
  return cat.toLowerCase().replace(/jewel+e?ry/, 'jewellery').replace(/\s+/g, ' ').trim();
};

const fallbackImage = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'; // A generic fallback image

const CategorySlider = ({ categories, onSelect }) => {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const scrollAmount = 220;
    sliderRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="category-slider-wrapper">
      <button className="slider-arrow left" onClick={() => scroll('left')}>&lt;</button>
      <div className="category-slider" ref={sliderRef}>
        {categories.map((cat, idx) => {
          const normalized = normalizeCategory(cat);
          const imgSrc = categoryImages[normalized] || fallbackImage;
          return (
            <div className="category-card" key={idx} onClick={() => onSelect(cat)}>
              <div className="category-img">
                <img src={imgSrc} alt={cat} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
              <div className="category-name">{cat}</div>
            </div>
          );
        })}
      </div>
      <button className="slider-arrow right" onClick={() => scroll('right')}>&gt;</button>
    </div>
  );
};

export default CategorySlider;
