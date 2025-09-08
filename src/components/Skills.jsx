// src/components/Skills.jsx
// UPGRADE: Animations are now staggered and fade in from the bottom.

import { motion } from "framer-motion";
import { textVariant, fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const SkillCard = ({ index, name, icon }) => (
  // CHANGE: Updated the animation variant for a cleaner effect
  <motion.div
    variants={fadeIn("up", "spring", index * 0.1, 0.5)}
    className="w-full bg-tertiary p-4 rounded-2xl shadow-lg"
  >
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <img src={icon} alt={name} className="w-16 h-16 object-contain" />
      <h3 className="text-white text-lg font-bold text-center">{name}</h3>
    </div>
  </motion.div>
);

const Skills = () => {
  return (
    <section id="skills" className="w-full">
      <motion.div variants={textVariant()} className="mb-12">
        <h2 className="text-white font-black text-3xl sm:text-5xl md:text-6xl">
          My <span className="text-[#915EFF]">Skills</span>
        </h2>
        <p className="mt-4 text-secondary text-[17px] max-w-3xl">
          Here are the technologies I've been working with recently.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {technologies.map((tech, index) => (
          <SkillCard key={tech.name} index={index} {...tech} />
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(Skills, "skills");