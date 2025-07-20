import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "../utils/motion";
import { TypingText } from "../components/CustomText";

const Header = () => {
  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden pt-16">
      {/* Background Image */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage: "url('/back.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(80%) brightness(0.6) hue-rotate(230deg)",
          backgroundColor: "rgba(80, 53, 165, 0.15)",
          willChange: "transform"
        }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-1 bg-gradient-to-b from-[#0a0416]/95 via-[#0a0416]/90 to-[#0a0416]/80" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            <motion.h1
              variants={fadeIn("down", "tween", 0.1, 1)}
              className="text-white lg:text-[80px] sm:text-[60px] text-[40px] lg:leading-[98px] font-bold"
            >
              Hi, I'm <span className="text-[#915EFF]">Apurba</span>
            </motion.h1>
            
            <motion.div variants={fadeIn("up", "tween", 0.2, 1)}>
              <TypingText 
                title="| Full Stack Developer | UI/UX Designer" 
                textStyles="text-white text-lg sm:text-xl mt-4" 
              />
            </motion.div>
            
            <motion.p
              variants={fadeIn("up", "tween", 0.3, 1)}
              className="text-[#dfd9ff] font-medium lg:text-[24px] sm:text-[20px] text-[16px] mt-6 max-w-3xl leading-relaxed"
            >
              I specialize in building modern web applications with responsive interfaces.
              <br className="hidden sm:block" />
              Let's collaborate to create something extraordinary!
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 w-full"
          variants={fadeIn("up", "tween", 0.4, 1)}
        >
          <a href="#about" className="flex flex-col items-center">
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center"
            >
              <div className="w-[30px] h-[50px] rounded-full border-2 border-[#915EFF] flex justify-center items-start p-1">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#915EFF]"
                  animate={{
                    y: [0, 8, 0]
                  }}
                />
              </div>
              <motion.p 
                className="text-[#aaa6c3] text-xs mt-2"
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                Scroll Down
              </motion.p>
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Header;