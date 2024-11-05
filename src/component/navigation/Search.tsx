// Search.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

const Search: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <motion.div className="relative">
      {/* Search Icon/Button */}
      <motion.button
        onClick={() => setSearchOpen((prev) => !prev)}
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="text-gradient transition-colors duration-300"
        aria-label="Search"
        style={{
          background: "linear-gradient(135deg, #ff7a7a, #ffc700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <FiSearch size={20} />
      </motion.button>

      {/* Search Input Field */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 mt-1"
          >
            <div className="flex items-center bg-[#1c1c1e] text-[#e5e5e5] rounded-full border border-[#3a3a3c] shadow-md px-3 py-1.5 space-x-2">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white placeholder-gray-500 outline-none flex-grow"
              />
              <motion.button
                onClick={() => setSearchOpen(false)}
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="text-[#e5e5e5] hover:text-[#ffb1b1]"
                aria-label="Close search"
              >
                <FiX size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Search;
