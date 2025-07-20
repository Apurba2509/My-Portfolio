import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const SkillCard = ({ index, name, icon }) => (
  <motion.div
    variants={fadeIn("right", "spring", index * 0.1, 0.75)}
    className="w-full bg-tertiary p-6 rounded-2xl shadow-lg"
  >
    <div className="flex flex-col items-center justify-center h-full">
      <img 
        src={icon} 
        alt={name} 
        className="w-20 h-20 object-contain mb-4"
      />
      <h3 className="text-white text-xl font-bold text-center">{name}</h3>
    </div>
  </motion.div>
);

const Skills = () => {
  return (
    <section id="skills" className="w-full">
      <motion.div variants={textVariant()} className="mb-16">
        <h2 className="text-white font-black text-4xl sm:text-5xl md:text-6xl">
          My <span className="text-[#915EFF]">Skills</span>
        </h2>
        <p className="mt-4 text-secondary text-lg max-w-3xl">
          Here are the technologies I've been working with recently.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {technologies.map((tech, index) => (
          <SkillCard key={tech.name} index={index} {...tech} />
        ))}
      </div>
    </section>



  );
};

export default SectionWrapper(Skills, "skills");