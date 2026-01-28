"use client";

import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About us", href: "/about" },
      { name: "Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
    ],
    contact: [
      { name: "Help & Support", href: "/support" },
      { name: "Partner with us", href: "/partner" },
      { name: "Ride with us", href: "/rider" },
    ],
    legal: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Refund & Cancellation", href: "/refund" },
    ],
  };

  const socialLinks = [
    { icon: faFacebookF, href: "#", label: "Facebook" },
    { icon: faTwitter, href: "#", label: "Twitter" },
    { icon: faInstagram, href: "#", label: "Instagram" },
    { icon: faLinkedinIn, href: "#", label: "LinkedIn" },
    { icon: faTiktok, href: "#", label: "TikTok" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold inline-block mb-4"
            >
              <span className="text-white">Crave</span>
              <span className="text-orange-500">x</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Delivering happiness, one meal at a time. Order from your favorite
              restaurants with just a few taps.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-4 h-4 text-orange-500"
                />
                <span>support@cravex.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="w-4 h-4 text-orange-500"
                />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="w-4 h-4 text-orange-500"
                />
                <span>123 Food Street, Dhaka</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-base font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h4 className="text-base font-semibold mb-5">Contact</h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social */}
          <div>
            <h4 className="text-base font-semibold mb-5">Legal</h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-base font-semibold mb-4">Follow us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-orange-500 hover:-translate-y-0.5 transition-all"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Cravex. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">We accept:</span>
            <div className="flex gap-2 text-xl opacity-70">
              <span>💳</span>
              <span>💲</span>
              <span>🏦</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
