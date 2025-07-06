import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import "./checkoutForm.css";
import { ClipLoader } from "react-spinners";

const CheckoutForm = ({ selectedPrice, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorCard, setErrorCard] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    setProcessing(true);
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setErrorCard(error.message);
      setProcessing(false);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setErrorCard(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {errorCard && <p className="text-red-400 mb-2">{errorCard}</p>}
      <div className="flex justify-between">
        <button
          className="px-3 py-1 cursor-pointer bg-green-400 rounded-md"
          type="submit"
          disabled={!stripe || processing}
        >
          {processing ? (
            <ClipLoader size={20} className="flex mt-1"></ClipLoader>
          ) : (
            `pay ${selectedPrice}$`
          )}
        </button>
        <button
          onClick={closeModal}
          className="px-3 py-1 cursor-pointer bg-red-400 rounded-md"
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
