// pages/buy-tea.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X } from "lucide-react";

export default function BuyTeaPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const paymentMethods = [
    { name: "M-Pesa", color: "bg-green-500", description: "Pay via Safaricom M-Pesa" },
    { name: "Airtel Money", color: "bg-red-500", description: "Pay via Airtel Money" },
    { name: "Bank Transfer", color: "bg-blue-500", description: "Pay directly via your bank" },
    { name: "PayPal", color: "bg-indigo-500", description: "Pay via PayPal" },
    { name: "Card Payment", color: "bg-yellow-500", description: "Pay via Visa/MasterCard" },
    { name: "Crypto", color: "bg-purple-500", description: "Pay via Bitcoin/Ethereum" },
  ];

  const handleConfirmPayment = () => {
    alert(`Processing ${selectedMethod} payment of KSh ${amount}...`);
    setAmount("");
    setSelectedMethod(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mt-4 mb-6">
        <Coffee size={32} className="text-yellow-600" />
        <h1 className="text-2xl font-bold text-gray-800">Buy Tea for Developers</h1>
      </div>

      {/* Payment Methods */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentMethods.map((method, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedMethod(method.name)}
            className={`text-white rounded-xl shadow-lg px-4 py-5 flex flex-col items-center justify-center ${method.color} hover:opacity-90 transition`}
          >
            <span className="font-bold text-lg">{method.name}</span>
            <span className="text-sm opacity-80">{method.description}</span>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-6 text-gray-500 text-sm text-center">
        Your support keeps us coding ☕💛
      </p>

      {/* Amount Modal */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Pay via {selectedMethod}
                </h2>
                <button onClick={() => setSelectedMethod(null)}>
                  <X size={20} className="text-gray-500 hover:text-gray-800" />
                </button>
              </div>

              {/* Amount Input */}
              <label className="block text-gray-700 mb-2">Enter Amount (KES)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 200"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={!amount}
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
              >
                Confirm Payment
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
