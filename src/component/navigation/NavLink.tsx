// NavLink.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Search from "./Search";

interface NavLinkProps {
  to: string;
  name: string;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, name, onClick, className }) => {
  const location = useLocation();

  return (
    <motion.li
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        to={to}
        onClick={onClick}
        className={`${
          location.pathname === to
            ? "text-lg font-semibold underline"
            : "text-xs hover:text-[#ffb1b1]"
        } transition-colors duration-300 ${className}`}
      >
        {name}
      </Link>
    </motion.li>
  );
};

export default NavLink;
