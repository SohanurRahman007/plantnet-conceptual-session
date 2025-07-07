import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import "./checkoutForm.css";
import { ClipLoader } from "react-spinners";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const CheckoutForm = ({ selectedPrice, closeModal, orderData, refetch }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const [errorCard, setErrorCard] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const getClientSecret = async () => {
      // server request
      const { data } = await axiosSecure.post("/create-payment-intent", {
        quantity: orderData?.quantity,
        plantId: orderData?.plantId,
      });
      setClientSecret(data.clientSecret);
    };
    getClientSecret();
  }, [axiosSecure, orderData]);

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

      // money
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (result?.error) {
        setErrorCard(result?.error?.message);
        return;
      }
      if (result?.paymentIntent?.status === "succeeded") {
        // save order data in db
        orderData.transactionId = result?.paymentIntent?.id;
        try {
          const { data } = await axiosSecure.post("/order", orderData);
          if (data?.insertedId) {
            toast.success("order Placed Successfully");
          }

          // update order data
          const { data: result } = await axiosSecure.patch(
            `/quantity-update/${orderData?.plantId}`,
            { quantityUpdate: orderData?.quantity, status: "decrease" }
          );
          console.log(result);
        } catch (err) {
          console.log(err);
        } finally {
          setProcessing(false);
          setErrorCard(null);
          refetch();
          closeModal();
        }

        // update product quantity plant from planCollection
      }
      console.log(result);
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
