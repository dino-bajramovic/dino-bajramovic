/**
 * @copyright 2025 dino-bajramovic
 * @license Apache-2.0
 */


import PropTypes from 'prop-types';

const ReviewCard = ({ cert }) => {
  return (
    <div className="bg-zinc-800 p-5 rounded-xl min-w-[320px] flex flex-col lg:min-w-[420px]">

      <figure className="img-box rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-900 h-48 flex items-center justify-center ring-1 ring-white/5">
        <img
          src={cert.imgSrc}
          alt={cert.title}
          loading="lazy"
          decoding="async"
          srcSet={`${cert.imgSrc} 1x`}
          sizes="(max-width: 1024px) 90vw, 420px"
          className="h-full w-auto object-contain"
        />
      </figure>

      <div className="mb-3">
        <p className="text-sm text-zinc-400">{cert.issuer} - {cert.year}</p>
        <h3 className="title-1 mt-1">{cert.title}</h3>
      </div>

      <p className="text-zinc-300 text-sm mb-4">
        {cert.description}
      </p>

      {cert.link && (
        <a
          href={cert.link}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm text-sky-400 hover:text-sky-300 underline mt-auto"
        >
          View credential
        </a>
      )}

    </div>
  )
}

ReviewCard.propTypes = {
  cert: PropTypes.shape({
    title: PropTypes.string.isRequired,
    issuer: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired,
}

export default ReviewCard
