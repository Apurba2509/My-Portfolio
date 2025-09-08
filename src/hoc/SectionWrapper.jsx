// src/hoc/SectionWrapper.jsx

import { motion } from "framer-motion";
import { staggerContainer } from "../utils/motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        // --- THIS IS THE FIX ---
        // I've added responsive padding here:
        // px-6 for mobile, sm:px-16 for larger screens.
        // py-10 for mobile, sm:py-16 for larger screens.
        // This will now match your navbar and give your content room to breathe.
        className={`px-6 sm:px-16 py-10 sm:py-16 max-w-7xl mx-auto relative z-0`}
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;