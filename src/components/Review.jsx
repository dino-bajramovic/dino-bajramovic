/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


/**
 * Node modules
 */
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';
import { useEffect, useRef } from 'react';


/**
 * Register gsap plugins
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);


/**
 * Components
 */
import ReviewCard from "./ReviewCard";


const certifications = [
  {
    title: 'STEM Games Participant',
    issuer: 'STEM Games, Umag',
    year: '2024 - 2025',
    description: 'Fakultetske igre sporta i programiranja (Umag 2024 i 2025) - timsko takmicenje i prakticni projekti.',
    imgSrc: '/images/Steleks - Dino Bajramovic.jpg'
  },
  {
    title: 'Google Developer Group & DevFest',
    issuer: 'Google',
    year: '2023 - 2025',
    description: 'GDG attendee (2024, 2025) i DevFest 2023 participant - fokus na web, cloud, AI alatima i community practices.',
    imgSrc: '/images/Google Dev Fest.jpg'
  },
  {
    title: 'Zira Talent Academy Certification',
    issuer: 'Zira',
    year: '2025',
    description: 'Full-stack curriculum with product thinking, delivery, and collaborative team practices.',
    imgSrc: '/images/ZTA - Dino Bajramovic.jpg'
  },
  {
    title: 'SoftSkills Academy Attendee',
    issuer: 'SoftSkills',
    year: '2024',
    description: 'Workshops on communication, stakeholder alignment, teamwork, and presentation skills.',
    imgSrc: '/images/Soft Skills Academy - Dino Bajramovic.jpg'
  },
  {
    title: 'NEAR Development 101',
    issuer: 'NEAR',
    year: '2022',
    description: 'Intro to smart contracts and dApp fundamentals on the NEAR ecosystem.',
    imgSrc: '/images/Near Balkan - Dino Bajramovic.jpg'
  },
  {
    title: 'HP LIFE Data Science Certificate',
    issuer: 'HP LIFE',
    year: '2024',
    description: 'Data literacy, analytics workflows, and practical visualization skills.',
    imgSrc: '/images/HP Life - Dino Bajramovic.jpg'
  }
];


const Review = () => {
  const scrollRef = useRef(null);

  useGSAP(() => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    gsap.to('.scrub-slide', {
      scrollTrigger: {
        trigger: '.scrub-slide',
        start: '-200% 80%',
        end: '400% 80%',
        scrub: true
      },
      x: '-1000'
    })
  });

  useEffect(() => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop) return;
    const container = scrollRef.current;
    if (!container) return;

    const target = container.querySelector('[data-cert-index="2"]'); // Zira card
    if (!target) return;

    const centerOffset = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
    requestAnimationFrame(() => {
      container.scrollLeft = Math.max(0, centerOffset);
    });
  }, []);

  return (
    <section
      id="reviews"
      className="section overflow-hidden"
    >
      <div className="container">

        <h2 className="headline-2 mb-8 reveal-up">
          Certifications
        </h2>

        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3 lg:hidden">
          <span className="material-symbols-rounded text-base">swipe_left</span>
          <span>Swipe to view more certifications</span>
          <span className="material-symbols-rounded text-base">swipe_right</span>
        </div>

        <div
          className="overflow-x-auto px-4 pb-2 touch-auto snap-x snap-mandatory overscroll-x-contain scrollbar-hide lg:overflow-visible lg:snap-none lg:overscroll-x-auto lg:px-0 lg:pb-0"
          ref={scrollRef}
        >
          <div className="scrub-slide flex items-stretch gap-3 px-4 min-w-max lg:px-0">
            {certifications.map((item, key) => (
              <div key={key} className="snap-start" data-cert-index={key}>
                <ReviewCard
                  cert={item}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Review
