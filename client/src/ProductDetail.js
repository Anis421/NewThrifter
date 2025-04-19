import React from 'react';
import './ProductDetail.css';

const ProductDetail = ({ product, onBack, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="product-detail-modal">
      <div className="product-detail-content">
        <button className="close-btn" onClick={onBack}>×</button>
        <img src={product.image} alt={product.title} className="detail-img" />
        <div className="detail-info">
          <h2>{product.title}</h2>
          <div className="detail-price">${product.price}</div>
          <div className="detail-category">Category: {product.category}</div>
          {product.rating && (
            <div className="detail-rating">
              Rating: {product.rating.rate} ({product.rating.count} reviews)
            </div>
          )}
          <p className="detail-desc">{product.description}</p>
          <button className="add-to-cart" onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
