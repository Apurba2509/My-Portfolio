// src/components/Skills.jsx

import { motion } from "framer-motion";
import { textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

// SkillCard component remains the same, it's already good.
const SkillCard = ({ name, icon }) => (
  <div className="w-full bg-tertiary p-4 rounded-2xl shadow-lg">
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <img src={icon} alt={name} className="w-16 h-16 object-contain" />
      <h3 className="text-white text-lg font-bold text-center">{name}</h3>
    </div>
  </div>
);

const Skills = () => {
  return (
    <section id="skills" className="w-full">
      <motion.div variants={textVariant()} className="mb-12">
        {/* CHANGE: Adjusted heading sizes for better mobile view */}
        <h2 className="text-white font-black text-3xl sm:text-5xl md:text-6xl">
          My <span className="text-[#915EFF]">Skills</span>
        </h2>
        <p className="mt-4 text-secondary text-[17px] max-w-3xl">
          Here are the technologies I've been working with recently.
        </p>
      </motion.div>

      {/* CHANGE: Increased gap for better spacing on all screen sizes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {technologies.map((tech) => (
          <SkillCard key={tech.name} {...tech} />
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(Skills, "skills");