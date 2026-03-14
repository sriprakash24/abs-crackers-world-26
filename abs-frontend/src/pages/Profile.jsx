import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import { User, Phone, Mail, Edit, ArrowLeft } from "lucide-react";

import logo from "../assets/logo1.png";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await API.get("/api/auth/profile");

      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 p-6">
      <div className="max-w-xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-red-600 font-semibold hover:underline"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>
      {/* LOGO */}

      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="ABS Crackers"
          className="h-20 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* PROFILE CARD */}

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>

        {/* NAME */}

        <div className="flex items-center gap-4 mb-4">
          <User className="text-red-500" />

          <div>
            <p className="text-sm text-gray-500">Name</p>

            <p className="font-semibold text-gray-800">{profile.name}</p>
          </div>
        </div>

        {/* PHONE */}

        <div className="flex items-center gap-4 mb-4">
          <Phone className="text-red-500" />

          <div>
            <p className="text-sm text-gray-500">Phone</p>

            <p className="font-semibold text-gray-800">{profile.phone}</p>
          </div>
        </div>

        {/* EMAIL */}

        <div className="flex items-center gap-4 mb-6">
          <Mail className="text-red-500" />

          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="font-semibold text-gray-800">
              {profile.email || "Not provided"}
            </p>
          </div>
        </div>

        {/* EDIT BUTTON */}

        <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          <Edit size={18} />
          Edit Profile
        </button>
      </div>

      {/* ADDRESS SECTION */}

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Addresses</h3>

          <button className="text-red-500 font-semibold hover:underline">
            + Add Address
          </button>
        </div>

        <p className="text-gray-500 text-sm">No addresses added yet.</p>
      </div>
    </div>
  );
}

export default Profile;
