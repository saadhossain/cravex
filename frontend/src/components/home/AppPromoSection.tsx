"use client";

import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AppPromoSection = () => {
  return (
    <section className="py-24 px-4 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Phone Mockups */}
          <div className="flex justify-center gap-[-2rem] relative">
            <div className="w-52 h-[420px] bg-gray-950 rounded-[32px] p-3 shadow-2xl relative z-10 translate-x-8">
              <div className="w-full h-full bg-gradient-to-br from-orange-50 to-white rounded-3xl overflow-hidden">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-xs text-gray-900">
                      Cravex
                    </div>
                    <div className="text-gray-400">•••</div>
                  </div>
                  <div className="h-7 bg-gray-100 rounded-full mb-3" />
                  <div className="flex gap-2 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-white rounded-xl" />
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-white rounded-xl" />
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-white rounded-xl" />
                  </div>
                  <div className="h-14 bg-white rounded-xl shadow-sm mb-2" />
                  <div className="h-14 bg-white rounded-xl shadow-sm" />
                </div>
              </div>
            </div>
            <div className="w-52 h-[420px] bg-gray-950 rounded-[32px] p-3 shadow-2xl -translate-x-8 scale-90 opacity-90">
              <div className="w-full h-full bg-gradient-to-br from-orange-50 to-white rounded-3xl overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-orange-500 to-orange-400 rounded-b-3xl" />
                <div className="p-4">
                  <div className="h-4 w-28 bg-gray-100 rounded-lg mb-2" />
                  <div className="h-2 w-full bg-gray-100 rounded mb-3" />
                  <div className="h-5 w-14 bg-gradient-to-r from-orange-500 to-orange-400 rounded-md mb-3" />
                  <div className="h-9 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Promo Text */}
          <div className="text-white text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Order<span className="text-orange-500">ing</span> is more
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Personalised & Instant
              </span>
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Download the Cravex app for faster ordering, exclusive deals, and
              real-time tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="flex items-center gap-3 px-5 py-3 bg-black rounded-xl border border-gray-700 hover:border-orange-500 hover:-translate-y-0.5 transition-all"
              >
                <FontAwesomeIcon
                  icon={faApple}
                  className="w-7 h-7 text-white"
                />
                <div className="text-left">
                  <span className="text-xs text-gray-400 block">
                    Download on the
                  </span>
                  <span className="text-base font-semibold text-white">
                    App Store
                  </span>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-5 py-3 bg-black rounded-xl border border-gray-700 hover:border-orange-500 hover:-translate-y-0.5 transition-all"
              >
                <FontAwesomeIcon
                  icon={faGooglePlay}
                  className="w-7 h-7 text-white"
                />
                <div className="text-left">
                  <span className="text-xs text-gray-400 block">Get it on</span>
                  <span className="text-base font-semibold text-white">
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromoSection;
