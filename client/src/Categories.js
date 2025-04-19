import React from 'react';
import './Categories.css';
import categoryImages from './categoryImages';

const Categories = ({ categories, onSelect }) => (
  <div className="categories-grid">
    {categories.map((cat, idx) => (
      <div className="category-card" key={idx} onClick={() => onSelect(cat)}>
        <div className="category-img" style={{background:'#eee',height:90,display:'flex',alignItems:'center',justifyContent:'center'}}>
          {categoryImages[cat.toLowerCase().replace(/jewel+e?ry/, 'jewellery')] ? (
            <img src={categoryImages[cat.toLowerCase().replace(/jewel+e?ry/, 'jewellery')]} alt={cat} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          ) : (
            <span style={{fontSize:'2rem'}}>{cat[0].toUpperCase()}</span>
          )}
        </div>
        <div className="category-name">{cat}</div>
      </div>
    ))}
  </div>
);

export default Categories;
