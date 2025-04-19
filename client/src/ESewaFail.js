import React from 'react';

export default function ESewaFail() {
  return (
    <div className="esewa-fail-modal" style={{position:'fixed',top:0,left:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:3000}}>
      <div style={{background:'#fff',borderRadius:12,padding:'2.5rem 2.5rem',boxShadow:'0 4px 24px rgba(0,0,0,0.14)',textAlign:'center',maxWidth:400}}>
        <h2 style={{color:'#c00'}}>Payment Failed</h2>
        <p>Your payment could not be processed. Please try again or use a different payment method.</p>
        <a href="/" style={{marginTop:24,display:'inline-block',color:'#fff',background:'#0090d0',padding:'0.7rem 2.2rem',borderRadius:6,textDecoration:'none',fontWeight:'bold'}}>Back to Home</a>
      </div>
    </div>
  );
}
