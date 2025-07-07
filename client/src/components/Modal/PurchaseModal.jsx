import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Form/CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {
  const { user } = useAuth();
  const { name, category, quantity, price, seller, _id } = plant || {};

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(price);
  const [orderData, setOrderData] = useState({
    seller,
    plantId: _id,
    quantity: 1,
    price: price,
    plantName: name,
    plantCategory: category,
    plantImage: Image,
  });

  useEffect(() => {
    if (user) {
      setOrderData((prev) => {
        return {
          ...prev,
          customer: {
            name: user?.displayName,
            email: user?.email,
            photo: user?.photoURL,
          },
        };
      });
    }
  }, [user]);

  // quantity and price handle
  const handleQuantity = (value) => {
    const totalQuantity = parseInt(value);
    if (totalQuantity > quantity)
      toast.error("No more Plant, please chose quantity based");
    const calculatePrice = totalQuantity * price;
    setSelectedPrice(calculatePrice);
    setSelectedQuantity(totalQuantity);

    setOrderData((prev) => {
      return { ...prev, price: calculatePrice, quantity: totalQuantity };
    });
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl"
          >
            <DialogTitle
              as="h3"
              className="text-lg font-medium text-center leading-6 text-gray-900"
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Plant: {name}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Category: {category}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Customer: {user?.displayName}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">Price per unit: $ {price}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Available Quantity: {quantity}
              </p>
            </div>

            <hr className="text-gray-400 mt-2" />
            <p className="text-md text-gray-600">Order Info</p>

            <div className="mt-2">
              <input
                // value={selectedQuantity}
                onChange={(e) => handleQuantity(e.target.value)}
                type="number"
                min={1}
                max={quantity}
                className="border-gray-400 border"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Available Quantity: {selectedQuantity}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Total Price: {selectedPrice}
              </p>
            </div>

            {/* stripe check from */}
            <Elements stripe={stripePromise}>
              <CheckoutForm
                selectedPrice={selectedPrice}
                closeModal={closeModal}
                orderData={orderData}
                refetch={refetch}
              />
            </Elements>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
