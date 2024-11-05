import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";
import Home from "./pages/Home";
import Nav from "./component/navigation/Nav";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <motion.div className="App bg-[var(--background-color)] text-[var(--text-color)] min-h-screen">
        {/* Nav component */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Nav className="sticky top-0 z-100 bg-black p-2" />
        </motion.div>

        {/* Home component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto p-4"
        >
          <Home />
        </motion.div>
      </motion.div>
    </Router>
  );
}

export default App;
