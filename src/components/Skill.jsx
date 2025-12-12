/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


/**
 * Components
 */
import SkillCard from "./SkillCard";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const skillItem = [
  {
    imgSrc: '/images/figma.svg',
    label: 'Figma',
    desc: 'Design tool'
  },
  {
    imgSrc: '/images/css3.svg',
    label: 'CSS',
    desc: 'User Interface'
  },
  {
    imgSrc: '/images/javascript.svg',
    label: 'JavaScript',
    desc: 'Interaction'
  },
  {
    imgSrc: '/images/nodejs.svg',
    label: 'NodeJS',
    desc: 'Web Server'
  },
  {
    imgSrc: '/images/expressjs.svg',
    label: 'ExpressJS',
    desc: 'Node Framework'
  },
  {
    imgSrc: '/images/mongodb.svg',
    label: 'MongoDB',
    desc: 'Database'
  },
  {
    imgSrc: '/images/react.svg',
    label: 'React',
    desc: 'Framework'
  },
  {
    imgSrc: '/images/tailwindcss.svg',
    label: 'TailwindCSS',
    desc: 'User Interface'
  },
  {
    imgSrc: '/images/java.png',
    label: 'Java',
    desc: 'Backend OOP'
  },
  {
    imgSrc: '/images/Apache Maven.png',
    label: 'Maven',
    desc: 'Build tooling'
  },
  {
    imgSrc: '/images/Next.js.png',
    label: 'Next.js',
    desc: 'Fullstack React'
  },
  {
    imgSrc: '/images/SQL.png',
    label: 'SQL',
    desc: 'Relational DB'
  },
  
];


const Skill = () => {
  const SKILL_LIMIT = 8;
  const [showAll, setShowAll] = useState(false);

  const hasExtra = skillItem.length > SKILL_LIMIT;
  const visibleItems = showAll ? skillItem : skillItem.slice(0, SKILL_LIMIT);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [showAll]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <section className="section">
      <div className="container">

        <h2 className="headline-2 reveal-up">
          Essential Tools I use
        </h2>

        <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] reveal-up">
          Discover the powerful tools and technologies I use to create exceptional, high-performing websites & applications.
        </p>

        <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]">
          {visibleItems.map(({ imgSrc, label, desc }, index) => (
            <SkillCard
              key={`${label}-${index}`}
              imgSrc={imgSrc}
              label={label}
              desc={desc}
              classes="reveal-up"
              style={showAll ? { opacity: 1, transform: 'none' } : undefined}
            />
          ))}
        </div>

        {hasExtra && (
          <div className="flex justify-center mt-6 relative z-10">
            <button
              type="button"
              className="btn btn-ghost text-sm relative z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAll((prev) => !prev);
              }}
            >
              {showAll ? 'Show less tools' : 'Show all tools'}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default Skill
