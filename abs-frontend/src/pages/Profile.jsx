import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Swal from "sweetalert2";

import { User, Phone, Mail, Edit, ArrowLeft, MapPin, Home } from "lucide-react";

import logo from "../assets/logo1.png";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: profile.name || "",
    phone: profile.phone || "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadAddresses = async () => {
    try {
      const res = await API.get("/api/address");

      setAddresses(res.data);
    } catch (error) {
      console.error("Failed to load addresses", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm({
      ...addressForm,
      [name]: value,
    });
  };

  const saveAddress = async () => {
    if (!addressForm.fullName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Full Name Required",
      });
    }

    if (!addressForm.phone.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Phone Number Required",
      });
    }

    if (!addressForm.addressLine.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Address Line Required",
      });
    }

    if (!addressForm.city.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "City Required",
      });
    }

    if (!addressForm.state.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "State Required",
      });
    }

    if (!addressForm.pincode.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Pincode Required",
      });
    }
    try {
      setSavingAddress(true);
      if (editingAddressId) {
        await API.put(`/api/address/${editingAddressId}`, addressForm);
      } else {
        await API.post("/api/address", addressForm);
      }

      setShowAddressModal(false);

      loadAddresses();
    } catch (error) {
      console.error("Save address failed", error);
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (id) => {
    const result = await Swal.fire({
      title: "Delete address?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/address/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });

      loadAddresses();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const editAddress = (addr) => {
    setEditingAddressId(addr.id);

    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });

    setShowAddressModal(true);
  };

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
    loadAddresses();
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
      <div className="sticky top-0 z-40 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 pb-4">
        <div className="max-w-xl mx-auto flex items-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-red-600 font-semibold hover:underline"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
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

        {/* <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          <Edit size={18} />
          Edit Profile
        </button> */}
      </div>

      {/* ADDRESS SECTION */}

      {/* ADDRESS SECTION */}

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Addresses</h3>

          <button
            onClick={() => {
              setEditingAddressId(null);
              setAddressForm({
                fullName: profile.name || "",
                phone: profile.phone || "",
                addressLine: "",
                city: "",
                state: "",
                pincode: "",
              });

              setShowAddressModal(true);
            }}
            className="text-red-500 font-semibold hover:underline"
          >
            + Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm">No addresses added yet.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{addr.fullName}</p>

                  <p className="text-sm text-gray-600">{addr.phone}</p>

                  <p className="text-sm text-gray-600">{addr.addressLine}</p>

                  <p className="text-sm text-gray-600">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => editAddress(addr)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD ADDRESS MODAL */}
      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-red-100 p-2 rounded-full">
                <MapPin className="text-red-500" size={20} />
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                Add Delivery Address
              </h3>
            </div>

            {/* FORM */}
            <div className="space-y-3">
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={addressForm.fullName}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <div className="relative">
                <Home
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  name="addressLine"
                  placeholder="Street Address"
                  value={addressForm.addressLine}
                  onChange={handleAddressChange}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />

                <input
                  name="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <input
                name="pincode"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={saveAddress}
                disabled={savingAddress}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {savingAddress ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Address"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔥 STICKY BACK TO HOME BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* background blur layer */}
        <div className="bg-white/80 backdrop-blur-md border-t border-orange-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div
            onClick={() => navigate("/cart", { replace: true })}
            className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition"
          >
            {/* TEXT */}
            <div>
              <p className="text-xs text-gray-400">Continue shopping</p>
              <p className="text-sm font-semibold text-gray-800">
                Back to cart
              </p>
            </div>

            {/* ICON */}
            <div className="bg-gradient-to-r from-red-500 to-orange-400 p-3 rounded-full shadow-md">
              <ArrowLeft className="text-white" size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
