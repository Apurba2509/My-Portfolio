import { useEffect, useState } from "react";
import { ScrollTrigger, reducedMotion } from "./lib/gsap";
import { getLenis, startSmoothScroll } from "./lib/smooth";
import { ReadyContext } from "./lib/ready";
import Preloader from "./components/Preloader";
import { GridOverlay, ScrollProgress } from "./components/Chrome";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Tapes from "./components/Tapes";
import Work from "./components/Work";
import Journey from "./components/Journey";
import Stack from "./components/Stack";
import Contact from "./components/Contact";

// The loader plays once per browser session.
const SEEN_KEY = "apurba:intro-seen";
function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export default function App() {
  const [ready, setReady] = useState(() => reducedMotion() || introSeen());

  useEffect(() => {
    const stop = startSmoothScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", !ready);
    if (ready) {
      getLenis()?.start();
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode: the loader simply plays again next time.
      }
    } else {
      getLenis()?.stop();
    }
  }, [ready]);

  return (
    <ReadyContext.Provider value={ready}>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      {!ready && <Preloader onReveal={() => setReady(true)} />}
      <Nav />
      <main id="content">
        <Hero />
        <About />
        <Tapes />
        <Work />
        <Journey />
        <Stack />
      </main>
      <Contact />
      <ScrollProgress />
      <GridOverlay />
    </ReadyContext.Provider>
  );
}
