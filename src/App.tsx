import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Nav from "./component/navigation/Nav";
import Footer from "./component/navigation/Footer";

// Import styles and third-party libraries
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <motion.div
        className="App bg-[var(--background-color)] text-[var(--text-color)] min-h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Navigation */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Nav className="sticky top-0 z-20 bg-black" />
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto flex-grow">
          <Home />
        </div>

        {/* Footer */}
        <Footer />
      </motion.div>
    </Router>
  );
}

export default App;
