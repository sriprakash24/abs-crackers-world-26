import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Truck, Sparkles } from "lucide-react";

function AboutPage() {
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

        <h2 className="text-xl font-bold text-gray-800">About Us</h2>
      </div>

      {/* HERO */}
      <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          ABS Crackers World
        </h1>
        <p className="text-gray-600 leading-relaxed text-sm">
          We are one of the trusted cracker suppliers based in Sivakasi,
          delivering premium quality fireworks with safety and reliability. Our
          goal is to bring joy to your celebrations with the best products at
          affordable prices.
        </p>
      </div>

      {/* FEATURES */}
      <div className="space-y-4">
        <Feature
          icon={<Sparkles />}
          title="Wide Variety"
          desc="From sparklers to sky shots, explore a wide range of products."
        />

        <Feature
          icon={<ShieldCheck />}
          title="Safety First"
          desc="All products are quality tested and meet safety standards."
        />

        <Feature
          icon={<Truck />}
          title="Fast Delivery"
          desc="Reliable delivery across Tamil Nadu before festive seasons."
        />
      </div>

      {/* FOOTER TEXT */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Bringing happiness to your celebrations 🎉
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

function Feature({ icon, title, desc }) {
  return (
    <div className="flex gap-4 items-start bg-white rounded-2xl p-4 shadow border border-orange-100">
      <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">{icon}</div>
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

export default AboutPage;
