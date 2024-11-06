// src/component/navigation/Footer.tsx

import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      className={`bg-opacity-10 backdrop-blur-lg border-t border-gray-700 text-[#dcdccd] py-10 ${className} mt-64`}
    >
      <motion.div
        className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo and Short Description */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link to="/" className="flex items-center space-x-2 text-[#ffb1b1]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
              alt="Popcorn Logo"
              className="h-8 w-8"
              loading="lazy"
            />
            <span className="text-lg font-bold tracking-wide">Popcorn</span>
          </Link>
          <p className="text-sm text-gray-400 text-center md:text-left max-w-xs">
            Dive into a world of movies and series. Explore, watch, and create
            your own list of favorites!
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-8 text-sm">
          {[
            { name: "About Us", path: "/about" },
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Contact", path: "/contact" },
            { name: "FAQ", path: "/faq" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="hover:text-[#ffb1b1] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4 text-lg text-gray-400">
          {[
            { icon: <FaFacebookF />, link: "https://facebook.com" },
            { icon: <FaTwitter />, link: "https://twitter.com" },
            { icon: <FaInstagram />, link: "https://instagram.com" },
            { icon: <FaYoutube />, link: "https://youtube.com" },
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: "#ffb1b1" }}
              className="transition-transform hover:text-[#ffb1b1]"
              aria-label={`Visit our ${
                item.link.split("//")[1].split(".")[0]
              } page`}
            >
              {item.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Copyright Section */}
      <motion.div
        className="text-center mt-8 text-sm text-gray-500 border-t border-gray-700 pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        © {new Date().getFullYear()} Popcorn. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
