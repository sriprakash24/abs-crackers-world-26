import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Mail, MessageCircle } from "lucide-react";

function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 p-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/70 backdrop-blur hover:bg-white"
        >
          <ArrowLeft className="text-red-500" />
        </button>

        <h2 className="text-xl font-bold text-gray-800">Contact</h2>
      </div>

      {/* CONTACT CARD */}
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-6 space-y-5">
        <ContactItem icon={<Phone />} title="Phone" value="+91 XXXXX XXXXX" />

        <ContactItem
          icon={<MapPin />}
          title="Location"
          value="Sivakasi, Tamil Nadu"
        />

        <ContactItem
          icon={<Mail />}
          title="Email"
          value="support@abscrackers.com"
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-6 space-y-3">
        <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow hover:bg-green-600 transition">
          <MessageCircle size={18} />
          Chat on WhatsApp
        </button>

        <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold shadow hover:bg-red-600 transition">
          Call Now
        </button>
      </div>
      {/* 🔥 STICKY BACK TO HOME BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* background blur layer */}
        <div className="bg-white/80 backdrop-blur-md border-t border-orange-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div
            onClick={() => navigate("/", { replace: true })}
            className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition"
          >
            {/* TEXT */}
            <div>
              <p className="text-xs text-gray-400">Continue shopping</p>
              <p className="text-sm font-semibold text-gray-800">
                Back to Home
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

function ContactItem({ icon, title, value }) {
  return (
    <div className="flex gap-4 items-center">
      <div className="bg-red-100 text-red-500 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default ContactPage;
