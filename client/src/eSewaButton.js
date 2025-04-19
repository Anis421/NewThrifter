import React, { useRef, useEffect } from 'react';

const ESEWA_FORM_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_SECRET = '8gBm/:&EnhH.1/q'; // Sandbox secret
const ESEWA_MERCHANT = 'EPAYTEST'; // Sandbox merchant code

function generateSignature({ total_amount, transaction_uuid, product_code }) {
  // HMAC-SHA256 signature using CryptoJS
  if (!window.CryptoJS) return '';
  const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = window.CryptoJS.HmacSHA256(data, ESEWA_SECRET);
  return window.CryptoJS.enc.Base64.stringify(hash);
}

const eSewaFields = [
  'amount', 'tax_amount', 'total_amount', 'transaction_uuid', 'product_code',
  'product_service_charge', 'product_delivery_charge', 'success_url', 'failure_url',
  'signed_field_names', 'signature', 'merchant_code',
];

const ESEWA_PRODUCT_CODE = 'EPAYTEST';

export default function ESewaButton({ total, onSuccess, onFailure, orderId }) {
  const formRef = useRef();
  const uuid = `ORD-${orderId}-${Date.now()}`;
  const successUrl = `${window.location.origin}/esewa/success?orderId=${orderId}`;
  const failureUrl = `${window.location.origin}/esewa/fail?orderId=${orderId}`;

  useEffect(() => {
    // Load CryptoJS if not already loaded
    if (!window.CryptoJS) {
      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js';
      document.body.appendChild(script1);
      const script2 = document.createElement('script');
      script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/hmac-sha256.min.js';
      document.body.appendChild(script2);
      const script3 = document.createElement('script');
      script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/enc-base64.min.js';
      document.body.appendChild(script3);
    }
  }, []);

  const handlePay = e => {
    e.preventDefault();
    // Generate signature
    const signature = generateSignature({
      total_amount: total,
      transaction_uuid: uuid,
      product_code: ESEWA_PRODUCT_CODE,
    });
    // Set form values
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
