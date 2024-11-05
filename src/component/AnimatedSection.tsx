// src/component/AnimatedSection.tsx
import React from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0.1,
  duration = 0.6,
  y = 30,
}) => (
  <motion.div
    initial={{ opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration }}
    className="space-y-4"
  >
    {children}
  </motion.div>
);

export default AnimatedSection;
