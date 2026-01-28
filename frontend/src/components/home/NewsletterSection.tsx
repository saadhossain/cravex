"use client";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-r from-orange-500 to-orange-400 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Text */}
          <div className="text-white text-center lg:text-left">
            <span className="text-5xl block mb-4">📧</span>
            <h2 className="text-3xl font-bold mb-4">
              Stay hungry for more deals!
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Subscribe to our newsletter and get exclusive offers, new
              restaurant alerts, and tasty updates delivered straight to your
              inbox.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {isSubmitted ? (
              <div className="flex items-center gap-3 p-6 bg-green-50 rounded-xl text-green-700 font-medium">
                <span className="text-2xl">🎉</span>
                <span>
                  Thanks for subscribing! Check your inbox for a welcome treat.
                </span>
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 mb-4"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 border-2 border-gray-100 rounded-xl text-base focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="w-3.5 h-3.5"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
            <p className="text-xs text-gray-500">
              By subscribing, you agree to our Privacy Policy. Unsubscribe
              anytime.
            </p>
          </div>
        </div>

        {/* Decorations */}
        <span className="hidden lg:block absolute top-[10%] left-[5%] text-5xl opacity-20 animate-bounce">
          🍕
        </span>
        <span
          className="hidden lg:block absolute bottom-[20%] left-[15%] text-5xl opacity-20 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          🍔
        </span>
        <span
          className="hidden lg:block absolute top-[20%] right-[10%] text-5xl opacity-20 animate-bounce"
          style={{ animationDelay: "2s" }}
        >
          🍟
        </span>
        <span
          className="hidden lg:block absolute bottom-[15%] right-[5%] text-5xl opacity-20 animate-bounce"
          style={{ animationDelay: "3s" }}
        >
          🥤
        </span>
      </div>
    </section>
  );
};

export default NewsletterSection;
