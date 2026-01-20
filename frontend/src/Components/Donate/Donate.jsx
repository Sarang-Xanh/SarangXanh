import React, { useState } from "react";
import Banner from "../Banner";
import { supabase } from "../../lib/supabase";

const amounts = [10, 25, 50, 100];

const Donate = () => {
  const [frequency, setFrequency] = useState("one-time");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyError, setNotifyError] = useState("");
  const [notifySuccess, setNotifySuccess] = useState("");
  const [notifySubmitting, setNotifySubmitting] = useState(false);

  const handleAmountClick = (value) => {
    setAmount(value);
    setCustomAmount("");
    setFormError("");
    setConfirmOpen(false);
  };

  const handleCustomChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setCustomAmount("");
      setAmount(0);
      return;
    }

    setCustomAmount(value);
    const numeric = Number(value);
    if (!Number.isNaN(numeric) && numeric >= 0) {
      setAmount(numeric);
    }
  };

  const handleSubmit = () => {
    setFormError("");
    setConfirmOpen(false);

    if (!frequency) {
      setFormError("Please select one-time or monthly.");
      return;
    }

    if (!amount || amount <= 0 || Number.isNaN(amount)) {
      setFormError("Please enter a valid amount.");
      return;
    }

    if (!provider) {
      setFormError("Please select a payment method.");
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setProcessing(true);
    setFormError("");

    // Stripe flow is temporarily disabled. We will wire up Toss/Kakao next.
    // TODO: call payment provider checkout (Toss/Kakao) here.
    setTimeout(() => {
      setProcessing(false);
      setConfirmOpen(false);
      setFormError("Payment integration is not configured yet.");
    }, 500);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Support Our Cleanup Work"
        subtitle="Your donation keeps our beaches cleaner and our community stronger."
        buttonText="Choose Your Gift"
        onButtonClick={() =>
          document
            .getElementById("donate-form")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div id="donate-form" className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-800">
            <p className="text-sm font-semibold">
              Payments aren’t live yet.{" "}
              <button
                type="button"
                onClick={() => {
                  setNotifyError("");
                  setNotifySuccess("");
                  setNotifyOpen(true);
                }}
                className="font-semibold underline-offset-4 hover:underline"
              >
                Get an email when payments are available?
              </button>
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Make a Donation
            </h2>
            <p className="text-gray-600">
              Choose a one-time or monthly gift to support our cleanup
              activities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFrequency("one-time")}
              className={`rounded-xl border px-5 py-4 text-left transition ${
                frequency === "one-time"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">
                One-time
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              className={`rounded-xl border px-5 py-4 text-left transition ${
                frequency === "monthly"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">
                Monthly
              </p>
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select a payment method
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setProvider("toss")}
                className={`rounded-xl border px-5 py-4 text-left transition ${
                  provider === "toss"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Toss Payments
                </p>
              </button>
              <button
                type="button"
                onClick={() => setProvider("kakao")}
                className={`rounded-xl border px-5 py-4 text-left transition ${
                  provider === "kakao"
                    ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 hover:border-yellow-200"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide">
                  KakaoPay
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select an amount
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAmountClick(value)}
                  className={`rounded-lg border px-4 py-3 font-semibold transition ${
                    amount === value && customAmount === ""
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  ${value}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2">
                Or enter a custom amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={handleCustomChange}
                  placeholder="Custom amount"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
              </div>
            </div>
          </div>

          {formError && (
            <div
              className="rounded-xl border border-red-200 bg-red-50/60 p-4 text-red-700"
            >
              <p className="text-sm">{formError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue to Donate
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close confirmation"
            onClick={() => setConfirmOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Confirm your donation
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You selected a{" "}
              <span className="font-semibold">
                {frequency === "monthly" ? "monthly" : "one-time"}
              </span>{" "}
              donation of{" "}
              <span className="font-semibold">${amount}</span>.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Payment method:{" "}
              <span className="font-semibold">
                {provider === "toss"
                  ? "Toss Payments"
                  : provider === "kakao"
                  ? "KakaoPay"
                  : "Not selected"}
              </span>
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={processing}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {processing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close notification modal"
            onClick={() => setNotifyOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Get notified when payments are live
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Leave your email and we will let you know as soon as donations are
              available.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="you@example.com"
              />
              {notifyError && (
                <p className="text-sm text-red-600 mt-2">{notifyError}</p>
              )}
              {notifySuccess && (
                <p className="text-sm text-green-600 mt-2">{notifySuccess}</p>
              )}
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setNotifyOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const submitNotify = async () => {
                    setNotifyError("");
                    setNotifySuccess("");
                    if (!notifyEmail.trim()) {
                      setNotifyError("Please enter a valid email.");
                      return;
                    }
                    if (!/^\S+@\S+\.\S+$/.test(notifyEmail.trim())) {
                      setNotifyError("Please enter a valid email.");
                      return;
                    }

                    setNotifySubmitting(true);
                    try {
                      const { error } = await supabase.functions.invoke(
                        "notify-donation",
                        { body: { email: notifyEmail.trim() } }
                      );
                      if (error) throw error;
                      setNotifySuccess(
                        "Thanks! We will email you once it's live."
                      );
                    } catch (err) {
                      console.error("Notify email error:", err);
                      setNotifyError("Unable to save your email right now.");
                    } finally {
                      setNotifySubmitting(false);
                    }
                  };

                  submitNotify();
                }}
                disabled={notifySubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {notifySubmitting ? "Saving..." : "Notify Me"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Donate;
