import { useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

// Hamburger Menu Icon Component
const MenuIcon = ({ isOpen }) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    initial={false}
    animate={isOpen ? "open" : "closed"}
    className="text-white hover:text-[#915EFF] transition-colors"
  >
    <motion.path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      variants={{
        closed: { d: "M2 6h20M2 12h20M2 18h20" },
        open: { d: "M4 18L18 4M4 4l14 14" }
      }}
      transition={{ duration: 0.3 }}
    />
  </motion.svg>
);

// Close Icon Component
const CloseIcon = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="text-white hover:text-[#915EFF] transition-colors"
    whileHover={{ rotate: 90 }}
    transition={{ duration: 0.3 }}
  >
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </motion.svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");

  return (
    <nav className="w-full flex items-center py-5 fixed top-0 z-20 bg-primary px-6 sm:px-16">
      {/* Logo Section */}
      <a 
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActive("");
        }}
        className="flex items-center gap-3 mr-auto group"
      >
        <img 
          src={logo} 
          alt="logo" 
          className="w-10 h-10 object-cover rounded-full border-2 border-transparent group-hover:border-[#915EFF] p-0.5 transition-all duration-300"
        />
        <span className="text-white text-xl font-bold group-hover:text-[#915EFF] transition-colors duration-300">
          Apurba
        </span>
      </a>

      {/* Desktop Navigation - With Underline Effect */}
      <ul className="list-none hidden sm:flex gap-8 ml-auto">
        {["home", "about", "skills", "projects", "contact"].map((nav) => (
          <li key={nav} className="relative group">
            <a
              href={`#${nav}`}
              className={`${
                active === nav ? "text-white" : "text-secondary"
              } hover:text-white font-medium text-[18px] relative`}
              onClick={() => setActive(nav)}
            >
              {nav.charAt(0).toUpperCase() + nav.slice(1)}
              <span 
                className={`absolute left-0 -bottom-1 h-0.5 bg-[#915EFF] transition-all duration-300 ${
                  active === nav ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <div className="sm:hidden flex">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon isOpen={isOpen} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 bg-primary/95 backdrop-blur-sm z-10 pt-24 px-6"
  >
    <ul className="flex flex-col gap-6 h-full">
      {["home", "about", "skills", "projects", "contact"].map((nav) => (
        <li key={nav} className="border-b border-[#915EFF]/30 pb-2">
          <a
            href={`#${nav}`}
            className={`text-2xl ${
              active === nav ? "text-[#915EFF]" : "text-white"
            } font-medium`}
            onClick={() => {
              setIsOpen(false);
              setActive(nav);
            }}
          >
            {nav.charAt(0).toUpperCase() + nav.slice(1)}
          </a>
        </li>
      ))}
    </ul>
    <div className="absolute bottom-10 left-0 right-0 text-center text-secondary text-sm">
      Swipe up/down to navigate
    </div>
  </motion.div>
)}
      </div>
    </nav>
  );
};

export default Navbar;