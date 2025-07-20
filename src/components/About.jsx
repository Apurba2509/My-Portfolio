import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { SectionWrapper } from "../hoc";

const About = () => {
  return (
    <div className="mt-20 bg-gray-900 rounded-3xl mx-6 sm:mx-16 overflow-hidden">
      {/* Main About Section */}
      <motion.div 
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="p-10 sm:p-12 bg-gray-800 rounded-3xl relative z-10"
      >
        <div className="max-w-4xl">
          <h2 className="text-white text-4xl sm:text-5xl font-bold mb-8">
            About <span className="text-[#915EFF]">Me</span>
          </h2>
          <motion.p
            variants={fadeIn("right", "spring", 0.3, 1)}
            className="text-gray-300 text-lg sm:text-xl leading-relaxed"
          >
            I'm a passionate full-stack developer with expertise in modern web technologies.
            Specializing in React, Node.js, and cloud platforms, I craft elegant solutions
            that balance technical excellence with outstanding user experiences. My approach
            combines clean code principles with thoughtful design to deliver impactful digital products.
          </motion.p>
        </div>
      </motion.div>

      {/* Education & Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 sm:px-8 pb-16 mt-8 relative">
        {/* Education Card */}
        <motion.div
          variants={fadeIn("right", "spring", 0.4, 1)}
          className="bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-[#915EFF] p-3 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-bold">Education</h3>
          </div>
          <div className="space-y-4 pl-14">
            <div>
              <p className="text-[#915EFF] font-semibold">Bachelor's in Computer Application</p>
              <p className="text-gray-300">Techno Main Salt Lake</p>
              <p className="text-gray-400 text-sm">2024 - 2028 | CGPA: 8.8/10.0</p>
            </div>
          </div>
        </motion.div>

        {/* Experience Card */}
        <motion.div
          variants={fadeIn("left", "spring", 0.4, 1)}
          className="bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-[#915EFF] p-3 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-bold">Experience</h3>
          </div>
          <div className="space-y-4 pl-14">
            <div>
              <p className="text-[#915EFF] font-semibold">Frontend Developer</p>
              <p className="text-gray-300">Fusion Weavers Inc.</p>
              <p className="text-gray-400 text-sm">2025 - Present | Remote</p>
              <ul className="mt-2 text-gray-300 text-sm list-disc list-inside space-y-1">
                <li>Developed 3 React applications</li>
                <li>Improved performance by 40%</li>
              </ul>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");