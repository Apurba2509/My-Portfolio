import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  return (
    <div className="relative z-0 bg-primary min-h-screen">
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Header />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-10">
        <About />
        <Skills />
        <Projects />
        <Contact />
      </div>
    </div>
  );
}