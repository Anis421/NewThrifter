import React, { useRef, useState } from 'react';
import CryptoJS from 'crypto-js';

const ESEWA_FORM_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_SECRET = '8gBm/:&EnhH.1/q'; // Sandbox secret
const ESEWA_MERCHANT = 'EPAYTEST'; // Sandbox merchant code
const ESEWA_PRODUCT_CODE = 'EPAYTEST';

function generateSignature(data, secret) {
  const hash = CryptoJS.HmacSHA256(data, secret);
  return CryptoJS.enc.Base64.stringify(hash);
}

export default function ESewaButton({ total, onSuccess, onFailure, orderId }) {
  const formRef = useRef();
  const uuid = `ORD-${orderId}-${Date.now()}`;
  const successUrl = `${window.location.origin}/esewa/success?orderId=${orderId}`;
  const failureUrl = `${window.location.origin}/esewa/fail?orderId=${orderId}`;

  const handlePay = e => {
    e.preventDefault();
    const data = `total_amount=${total},transaction_uuid=${uuid},product_code=${ESEWA_PRODUCT_CODE}`;
    const signature = generateSignature(data, ESEWA_SECRET);
    if (formRef.current) {
      formRef.current.signature.value = signature;
      formRef.current.submit();
    }
  };

  return (
    <form
      ref={formRef}
      action={ESEWA_FORM_URL}
      method="POST"
      target="_blank"
      style={{ display: 'inline' }}
    >
      <input type="hidden" name="amount" value={total} />
      <input type="hidden" name="tax_amount" value="0" />
      <input type="hidden" name="total_amount" value={total} id="total_amount" />
      <input type="hidden" name="transaction_uuid" value={uuid} id="transaction_uuid" />
      <input type="hidden" name="product_code" value={ESEWA_PRODUCT_CODE} id="product_code" />
      <input type="hidden" name="product_service_charge" value="0" />
      <input type="hidden" name="product_delivery_charge" value="0" />
      <input type="hidden" name="success_url" value={successUrl} />
      <input type="hidden" name="failure_url" value={failureUrl} />
      <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
      <input type="hidden" name="signature" id="signature" />
      <input type="hidden" name="merchant_code" value={ESEWA_MERCHANT} />
      <button type="button" className="esewa-btn" onClick={handlePay} style={{ background: '#60bb46', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
        Pay with eSewa
      </button>
    </form>
  );
}
