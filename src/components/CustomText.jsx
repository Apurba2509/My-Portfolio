import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const TypingText = ({ title, textStyles }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < title.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + title[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, title]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${textStyles} font-mono`}
    >
      {displayText}
      <span className="animate-blink">|</span>
    </motion.p>
  );
};

export const TitleText = ({ title, textStyles }) => {
  return (
    <h2
      className={`mt-[8px] font-bold md:text-[64px] text-[40px] text-white ${textStyles}`}
    >
      {title}
    </h2>
  );
};