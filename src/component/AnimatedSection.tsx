// src/component/AnimatedSection.tsx
import React from "react";
import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0.1,
  duration = 0.6,
  y = 30,
  className = "",
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    transition={{ delay, duration }}
    className={`space-y-4 ${className}`}
  >
    {children}
  </motion.div>
);

export default AnimatedSection;
