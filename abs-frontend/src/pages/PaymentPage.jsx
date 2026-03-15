import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";
import logo from "../assets/logo1.png";
import qr from "../assets/upi-qr.png";
import { useRef } from "react";

import {
  CreditCard,
  QrCode,
  Landmark,
  Upload,
  Hash,
  ShieldCheck,
} from "lucide-react";

function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [reference, setReference] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const submitPayment = async () => {
    if (!reference) {
      Swal.fire({
        icon: "warning",
        title: "Reference Required",
        text: "Enter UTR / payment reference number",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Screenshot Required",
        text: "Upload payment screenshot",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("reference", reference);

      await API.post(`/api/orders/${orderId}/submit-payment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "Payment Submitted",
        text: "Our team will verify your payment shortly.",
        confirmButtonColor: "#dc2626",
      });

      navigate("/orders", { replace: true });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <img src={logo} alt="ABS Crackers" className="h-16 object-contain" />
        </div>

        {/* HEADER */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="text-red-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">
          Order ID : <span className="font-semibold">{orderId}</span>
        </p>

        {/* UPI SECTION */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <QrCode className="text-red-500" size={20} />
            <p className="font-semibold text-red-700">Scan & Pay via UPI</p>
          </div>

          <img src={qr} alt="UPI QR" className="w-40 mx-auto mb-3" />

          <p className="text-sm text-gray-700">
            UPI ID : <b>abscrackers@upi</b>
          </p>
        </div>

        {/* BANK TRANSFER */}
        <div className="bg-gray-50 border rounded-xl p-4 mb-6 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="text-red-500" size={18} />
            <p className="font-semibold">Bank Transfer</p>
          </div>

          <div className="space-y-1 text-gray-700">
            <p>
              Account Name : <b>ABS Crackers</b>
            </p>

            <p>
              Account No : <b>1234567890</b>
            </p>

            <p>
              IFSC : <b>HDFC0001234</b>
            </p>

            <p>
              Phone : <b>9876543210</b>
            </p>
          </div>
        </div>

        {/* REFERENCE INPUT */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Hash size={16} />
            Payment Reference / UTR
          </label>

          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter UTR / reference number"
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-400 outline-none"
          />
        </div>

        {/* SCREENSHOT UPLOAD */}

        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Upload size={16} />
            Upload Payment Screenshot
          </label>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-400 transition"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="mx-auto text-gray-400 mb-2" size={28} />

            <p className="text-sm text-gray-600">Click to upload screenshot</p>

            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>

            {file && (
              <p className="text-green-600 text-sm mt-2 font-semibold">
                Selected: {file.name}
              </p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* SECURITY NOTE */}
        <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
          <ShieldCheck size={16} className="text-green-500 mt-[2px]" />
          <p>
            After submitting payment proof, our team will verify your payment
            within 30 minutes.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={submitPayment}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-lg font-semibold flex items-center justify-center"
        >
          {loading ? "Submitting..." : "Submit Payment"}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
