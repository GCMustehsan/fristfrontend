import React, { useState } from "react";
import axios from "../AxiosInstance"; // Ensure you have axiosInstance set up for API calls
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    amount: "25",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const userId = localStorage.getItem("userId");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First name is required.";
    if (!formData.lastName) errors.lastName = "Last name is required.";
    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) {
      errors.cardNumber = "A valid 16-digit card number is required.";
    }
    if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      errors.expiry = "Expiry date must be in MM/YY format.";
    }
    if (!formData.cvc || !/^\d{3}$/.test(formData.cvc)) {
      errors.cvc = "A valid 3-digit CVC is required.";
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errors.amount = "A valid amount is required.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setIsProcessing(true);

    const requestData = {
      user_id: userId,
      amount: parseFloat(formData.amount),
      currency: "usd",
      source: "tok_visa", // Hardcoded source
      cardholder_first_name: formData.firstName,
      cardholder_last_name: formData.lastName,
      card_number: formData.cardNumber,
      expiration_date: formData.expiry,
      cvc: formData.cvc,
    };

    try {
      const response = await axios.post("/create-charge", requestData);
      const { success, payment, message } = response.data;

      if (success) {
        localStorage.setItem("paymentSuccess", true);
        setDialogMessage(`Payment successful! Transaction ID: ${payment.stripe_charge_id}`);
      } else {
        setDialogMessage("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setDialogMessage("An error occurred while processing your payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-xl text-gray-700 dark:text-white font-semibold">
            Month to Month Payment
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                disabled 
                placeholder="USD"
                className="w-full pl-12 h-12 text-lg border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                USD
              </span>
            </div>
            {validationErrors.amount && (
              <p className="text-sm text-red-500">{validationErrors.amount}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Price after 1st month of service (1st charge to be prorated)
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white">
              Credit Card Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full h-12 px-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                />
                {validationErrors.firstName && (
                  <p className="text-sm text-red-500">{validationErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full h-12 px-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                />
                {validationErrors.lastName && (
                  <p className="text-sm text-red-500">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-2">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 1234 1234 1234"
                    className="w-full h-12 px-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <FaCcVisa className="w-8 h-8 text-blue-600" />
                    <FaCcMastercard className="w-8 h-8 text-[#eb001b]" />
                    <FaCcAmex className="w-8 h-8 text-[#2e77bb]" />
                    <FaCcDiscover className="w-8 h-8 text-[#ff6000]" />
                  </div>
                </div>
                {validationErrors.cardNumber && (
                  <p className="text-sm text-red-500">{validationErrors.cardNumber}</p>
                )}
              </div>

              <div className="md:col-span-3 space-y-2">
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  MM / YY
                </label>
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  placeholder="MM / YY"
                  className="w-full h-12 px-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                />
                {validationErrors.expiry && (
                  <p className="text-sm text-red-500">{validationErrors.expiry}</p>
                )}
              </div>

              <div className="md:col-span-3 space-y-2">
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  CVC
                  <HiInformationCircle className="w-5 h-5 text-gray-400" />
                </label>
                <input
                  id="cvc"
                  name="cvc"
                  type="text"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  placeholder="CVC"
                  className="w-full h-12 px-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                />
                {validationErrors.cvc && (
                  <p className="text-sm text-red-500">{validationErrors.cvc}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Submit Payment"}
            </button>
          </div>
        </form>

        {dialogMessage && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-md">
            {dialogMessage}
          </div>
        )}
      </div>
    </div>
  );
}
