/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


/**
 * Components
 */
import { ButtonPrimary, ButtonOutline } from "./Button";


const Hero = () => {
  return (
    <section
      id="home"
      className="pt-28 lg:pt-36"
    >
      <div className="container items-center lg:grid lg:grid-cols-2 lg:gap-10">

        <div>
          <div className="flex items-center gap-3">
            <figure className="img-box w-9 h-9 rounded-lg">
              <img
                src="/images/avatar-1.png"
                width={40}
                height={40}
                alt="Portrait of Dino Bajramovic"
                className="img-cover"
              />
            </figure>

            <div className="flex items-center gap-1.5 text-zinc-400 text-sm tracking-wide">
              <span className="relative w-2 h-2 rounded-full bg-emerald-400">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
              </span>

              Available for work
            </div>
          </div>

          <h1 className="headline-1 max-w-[15ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-4 lg:mb-6">
            Full-stack web developer building scalable projects & modern websites
          </h1>

          <p className="text-zinc-300 text-lg mb-6 max-w-[40ch]">
            I design, build, and ship performant React/Node.js work from concept to launch, with a clear path to contact and collaboration.
          </p>

          <div className="flex items-center gap-3">
            <ButtonPrimary
              label="Download CV"
              icon="download"
              href="/files/dino-bajramovic-cv.pdf"
              download="Dino_Bajramovic_CV.pdf"
            />

            <ButtonOutline
              href="#about"
              label="Scroll down"
              icon="arrow_downward"
            />
          </div>
        </div>

        <div className="hidden lg:block">
          <figure className="w-full max-w-[480px] ml-auto bg-gradient-to-t from-sky-400 via-25% via-sky-400/40 to-65% rounded-[60px] overflow-hidden">
            <picture>
              <source srcSet="/images/hero-banner.avif" type="image/avif" />
              <source srcSet="/images/hero-banner.webp" type="image/webp" />
              <img
                src="/images/hero-banner.jpg"
                width={656}
                height={800}
                alt="Hero illustration for Dino Bajramovic portfolio"
                className="w-full"
                fetchpriority="high"
                decoding="async"
                sizes="(max-width: 1024px) 90vw, 480px"
              />
            </picture>
          </figure>
        </div>

      </div>

    </section>
  )
}

export default Hero
