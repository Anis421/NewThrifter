import React from 'react';
import './Categories.css';

const Categories = ({ categories, onSelect }) => (
  <div className="categories-grid">
    {categories.map((cat, idx) => (
      <div className="category-card" key={idx} onClick={() => onSelect(cat)}>
        <div className="category-img" style={{background:'#eee',height:90,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>{cat[0].toUpperCase()}</div>
        <div className="category-name">{cat}</div>
      </div>
    ))}
  </div>
);

export default Categories;
