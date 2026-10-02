import { useEffect, useState, useSyncExternalStore } from "react";
import { ScrollTrigger, reducedMotion } from "./lib/gsap";
import { getLenis, startSmoothScroll } from "./lib/smooth";
import { ReadyContext } from "./lib/ready";
import { registerAgentTools } from "./lib/agent-tools";
import Preloader from "./components/Preloader";
import { GridOverlay, ScrollProgress } from "./components/Chrome";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Tapes from "./components/Tapes";
import Work from "./components/Work";
import Journey from "./components/Journey";
import Stack from "./components/Stack";
import Faq from "./components/Faq";
import Contact from "./components/Contact";

// The loader plays once per browser session, and never for people who prefer reduced motion.
const SEEN_KEY = "apurba:intro-seen";
function skipIntro() {
  try {
    return reducedMotion() || sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
const noSubscribe = () => () => {};

export default function App() {
  // The pre-rendered HTML always includes the loader; the browser drops it before the first
  // paint when it isn't needed, so the server and client markup match during hydration.
  const skip = useSyncExternalStore(noSubscribe, skipIntro, () => false);
  const [revealed, setRevealed] = useState(false);
  const ready = skip || revealed;

  useEffect(() => {
    const stop = startSmoothScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, []);

  // Let AI agents in the browser ask for facts about Apurba directly (WebMCP).
  useEffect(() => registerAgentTools(), []);

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
      {!ready && <Preloader onReveal={() => setRevealed(true)} />}
      <Nav />
      <main id="content">
        <Hero />
        <About />
        <Tapes />
        <Work />
        <Journey />
        <Stack />
        <Faq />
      </main>
      <Contact />
      <ScrollProgress />
      <GridOverlay />
    </ReadyContext.Provider>
  );
}
