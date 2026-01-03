import React, { useState } from "react";

const DonationStepper = () => {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(null);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-[#FFFCF6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6">
        {/* Stepper */}
        <div className="flex items-center justify-between px-4">
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`w-8 h-8 rounded-full border-2 z-10 flex items-center justify-center text-white text-sm font-medium ${
                  i <= step
                    ? "bg-blue-600 border-blue-600"
                    : "border-blue-300 bg-white"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && (
                <div className="flex-1 h-0.5 bg-blue-300 mx-2 relative z-0">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                      step > i ? "bg-blue-600 w-full" : "bg-blue-300 w-0"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-4">
          {["Become a donor", "Choose amount", "Payment"].map((label, i) => (
            <span key={i} className="w-1/3 text-center">
              {label}
            </span>
          ))}
        </div>

        <div className="mt-10">
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Become a donor</h2>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in eros elementum tristique.
              </p>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
              >
                Get started
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose an amount</h2>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[1, 5, 10, 15].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-4 border rounded-lg text-center font-bold transition-all duration-200 ${
                      amount === amt
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "hover:border-blue-400"
                    }`}
                  >
                    <div className="text-lg">${amt}</div>
                    <div className="text-sm font-normal mt-1">
                      {amt === 1
                        ? "Supporter"
                        : amt === 5
                        ? "Fan"
                        : amt === 10
                        ? "Big Fan"
                        : "Super Fan"}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="text-gray-600 hover:underline"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                  disabled={amount === null}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Scan to Pay</h2>
              <p className="text-gray-600 mb-6">
                Use the QR code below to complete your donation of{" "}
                <strong>${amount}</strong>.
              </p>
              <div className="flex justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=payto://example"
                  alt="Payment QR Code"
                  className="rounded-lg border"
                />
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setStep(0);
                    setAmount(null);
                  }}
                  className="text-gray-600 hover:underline"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationStepper;
