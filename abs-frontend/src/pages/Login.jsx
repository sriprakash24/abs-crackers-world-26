import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";

import logo from "../assets/logo1.png";

function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post("/api/auth/login", {
        phone,
        password,
      });

      const token = response.data;

      localStorage.setItem("token", token);

      /* Decode JWT to get role */
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data?.message || "Invalid login credentials",
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
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
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

          {/* PASSWORD */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 outline-none shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              👁
            </span>
          </div>
          <div className="text-right text-sm">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-red-500 cursor-pointer font-medium"
            >
              Forgot Password?
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-red-500 cursor-pointer ml-1 font-semibold"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
