import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";
import logo from "../assets/logo1.png";

function ForgotPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password mismatch",
        text: "New password and confirm password must match",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    try {
      setLoading(true);

      await API.post("/api/auth/reset-password", {
        phone,
        newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been updated successfully",
        confirmButtonColor: "#dc2626",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: error?.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-50 to-yellow-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-10">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="ABS Crackers" className="h-20 drop-shadow-md" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="space-y-5">
          {/* PHONE */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📱</span>
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* NEW PASSWORD */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              👁
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔒</span>

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Remember your password?
          <span
            onClick={() => navigate("/login")}
            className="text-red-500 cursor-pointer ml-1 font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
