import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import throttle from "lodash/throttle";
import { FiSearch, FiX } from "react-icons/fi";
import NavLink from "./NavLink"; // Ensure path is correct
import Search from "./Search"; // Import Search component

type NavProps = {
  className?: string;
};

const Nav: React.FC<NavProps> = ({ className }) => {
  const [show, setShow] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const handleToggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    }, 200);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidePanelRef.current &&
        event.target instanceof Node &&
        !sidePanelRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: show ? 0 : -80 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full sticky top-0 z-50 shadow-lg backdrop-blur-lg bg-opacity-10 ${className}`}
    >
      <motion.div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 cursor-pointer">
          <motion.div whileHover={{ scale: 1.07 }}>
            <motion.img
              className="h-8 w-auto sm:h-10"
              src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
              alt="Popcorn Logo"
              loading="lazy"
            />
            <motion.h2 className="text-[#dcdccd] text-sm font-bold tracking-wide">
              Popcorn
            </motion.h2>
          </motion.div>
        </Link>

        {/* Desktop Nav Links */}
        <motion.ul className="hidden md:flex space-x-8 text-[#dcdccd]">
          {[
            { name: "Startsiden", path: "/" },
            { name: "Serier", path: "/serier" },
            { name: "Film", path: "/film" },
            { name: "Nytt og Populært", path: "/nytt-og-populært" },
            { name: "Min liste", path: "/min-liste" },
          ].map((item, index) => (
            <NavLink key={index} to={item.path} name={item.name} />
          ))}
        </motion.ul>

        {/* Search Component */}
        <Search />

        {/* Background Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-[#151717] opacity-60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidepanel for Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={sidePanelRef}
              className="fixed inset-y-0 right-0 w-4/5 max-w-sm p-6 md:hidden z-50 shadow-lg"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                backgroundColor: "rgba(21, 23, 23, 0.7)",
                backdropFilter: "blur(15px)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <motion.ul className="space-y-6 text-[#e5e5e5]">
                {[
                  { name: "Startsiden", path: "/" },
                  { name: "Serier", path: "/serier" },
                  { name: "Film", path: "/film" },
                  { name: "Nytt og Populært", path: "/nytt-og-populært" },
                  { name: "Min liste", path: "/min-liste" },
                ].map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    name={item.name}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
};

export default Nav;
