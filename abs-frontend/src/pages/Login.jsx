import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [phone, setphone] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/auth/login", {
        phone,
        password,
      });

      const token = response.data;

      localStorage.setItem("token", token);

      /* Decode JWT to get role */
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      /* Redirect based on role */
      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Mobile Number"
          className="w-full border p-2 mb-3"
          value={phone}
          onChange={(e) => setphone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-red-500 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
