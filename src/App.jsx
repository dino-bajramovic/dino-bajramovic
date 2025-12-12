/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


/**
 * Node modules
 */
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';
import { useState } from "react";


/**
 * Register gsap plugins
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);


/**
 * Components
 */
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skill from "./components/Skill";
import Work from "./components/Work";
import Review from "./components/Review";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import SEO from "./components/SEO";


const App = () => {
  const [adminOpen, setAdminOpen] = useState(false);

  useGSAP(() => {
    const elements = gsap.utils.toArray('.reveal-up');

    elements.forEach((element) => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: '-200 bottom',
          end: 'bottom 80%',
          scrub: true
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      })
    });
  });

  return (
    <ReactLenis root>
      <SEO />
      <Header onOpenAdmin={() => setAdminOpen(true)} />
      <main>
        <Hero />
        <About />
        <Skill />
        <Work />
        <Review />
        <Contact />
      </main>
      {adminOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-zinc-900/95 border border-zinc-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50">
              <p className="font-semibold text-zinc-100">Admin Dashboard</p>
              <button
                type="button"
                onClick={() => setAdminOpen(false)}
                className="text-sm text-zinc-300 hover:text-white"
              >
                Close
              </button>
            </div>
            <div
              className="p-4 overflow-y-auto overflow-x-hidden max-h-[80vh] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900/40"
              data-lenis-prevent
              data-lenis-prevent-wheel
            >
              <AdminPanel />
            </div>
          </div>
        </div>
      )}
      <Footer />
    </ReactLenis>
  )

}


export default App;
