/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


/**
 * Node modules
 */
import { useState } from "react";


/**
 * Components
 */
import Navbar from "./Navbar";


const Header = ({ onOpenAdmin }) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center z-40 bg-gradient-to-b from-zinc-900 to-zinc-900/0">
      <div className="max-w-screen-2xl w-full mx-auto px-4 flex justify-between items-center md:px-6 md:grid md:grid-cols-[1fr,3fr,1fr]">

        <h1>
          <a
            href="/"
            className="logo"
          >
            <img
              src="/images/logo.png"
              width={48}
              height={48}
              alt="Dino Bajramovic logo"
            />
          </a>
        </h1>

        <div className="relative md:justify-self-center">
          <button
            className="menu-btn md:hidden"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span className="material-symbols-rounded">
              {navOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Navbar
            navOpen={navOpen}
            onOpenAdmin={onOpenAdmin}
            onCloseNav={() => setNavOpen(false)}
          />
        </div>

        <div className="flex items-center gap-2 max-md:hidden md:justify-self-end">
          <a
            href="#contact"
            className="btn btn-secondary"
          >
            Contact Me
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="btn btn-ghost"
          >
            Admin Login
          </button>
        </div>

      </div>
    </header>
  )
}

export default Header
