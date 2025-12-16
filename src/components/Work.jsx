/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


/**
 * Components
 */
import ProjectCard from "./ProjectCard";
import { useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const works = [
  {
    imgSrc: '/images/project-1.jpg',
    title: 'Library software project',
    tags: ['CRUD', 'Full-stack', 'Management'],
    projectLink: 'https://github.com/dino-bajramovic/library-software-project'
  },
  {
    imgSrc: '/images/project-2.jpg',
    title: 'Real estate project',
    tags: ['Web-tehnologije', 'CRUD', 'Responsive'],
    projectLink: 'https://github.com/dino-bajramovic/nekretnine-projekat-web-tehnologije'
  },
  {
    imgSrc: '/images/project-3.jpg',
    title: 'News summarizer AI',
    tags: ['AI', 'API', 'Summarization'],
    projectLink: 'https://github.com/dino-bajramovic/news-summaizer-ai'
  },
  {
    imgSrc: '/images/project-4.jpg',
    title: 'Movie project',
    tags: ['React', 'UI', 'Reusable'],
    projectLink: 'https://github.com/dino-bajramovic/react-project'
  },
  {
    imgSrc: '/images/project-5.jpg',
    title: 'Marketing campaign management',
    tags: ['CRM', 'Analytics', 'Full-stack'],
    projectLink: 'https://github.com/dino-bajramovic/MarketingCampaignManagementSystem'
  },
  {
    imgSrc: '/images/project-6.jpg',
    title: 'MERN project',
    tags: ['MERN', 'Full-stack', 'App'],
    projectLink: 'https://github.com/dino-bajramovic/mern-project'
  },
];


const Work = () => {
  const WORK_LIMIT = 6;
  const [showAll, setShowAll] = useState(false);
  const hasExtra = works.length > WORK_LIMIT;
  const visibleWorks = showAll ? works : works.slice(0, WORK_LIMIT);

  useEffect(() => {
    // Ensure newly shown cards are measured by ScrollTrigger/animations
    ScrollTrigger.refresh();
  }, [showAll]);

  return (
    <section
      id="work"
      className="section"
    >
      <div className="container">

        <h2 className="headline-2 mb-8 reveal-up">
          Project work highlights from my stack
        </h2>

        <div className="grid gap-x-4 gap-y-5 grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]">
          {visibleWorks.map(({ imgSrc, title, tags, projectLink }, index) => (
            <ProjectCard
              key={`${title}-${index}`}
              imgSrc={imgSrc}
              title={title}
              tags={tags}
              projectLink={projectLink}
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
              {showAll ? 'Show less projects' : 'Show all projects'}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

export default Work
