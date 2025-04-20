import React from "react";

const ESewaPaymentButton = ({ amount, pid }) => {
  // eSewa test merchant code and URLs
  const merchantCode = "epaytest";
  const successUrl = "http://localhost:3000/esewa-success";
  const failureUrl = "http://localhost:3000/esewa-fail";

  return (
    <form
      action="https://rc-epay.esewa.com.np/epay/main"
      method="POST"
      style={{ display: "inline" }}
    >
      <input type="hidden" name="amt" value={amount} />
      <input type="hidden" name="pdc" value="0" />
      <input type="hidden" name="psc" value="0" />
      <input type="hidden" name="txAmt" value="0" />
      <input type="hidden" name="tAmt" value={amount} />
      <input type="hidden" name="pid" value={pid} />
      <input type="hidden" name="scd" value={merchantCode} />
      <input type="hidden" name="su" value={successUrl} />
      <input type="hidden" name="fu" value={failureUrl} />
      <button type="submit">Pay with eSewa</button>
    </form>
  );
};

export default ESewaPaymentButton;
