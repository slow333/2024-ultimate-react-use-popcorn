import React, {useState} from "react";
import PropTypes from "prop-types";

const containerStyle = {
  display: 'flex', alignItems: 'center', gap: '12px'
}
const startContainerStyle = {
  display: 'flex', gap: '1px'
}

StarRating.prototype = {
  maxRating: PropTypes.number,
  fullColor: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
  className: PropTypes.string,
}

function StarRating({
  maxRating = 5,
  fullColor = "#f00", size = 30,
  className = "", messages = [],
  defaultRating = 0, onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0)

  const textStyle = {
    lineHeight: '0', margin: '0', padding: '0', fontStyle: 'bold',
    fontSize: `${size / 1.2}px`, color: fullColor
  }

  function handleRating(rating) {
    setRating(rating)
    onSetRating(rating)
  }

  return (
       <div style={containerStyle} className={className}>
         <div style={startContainerStyle}>
           {Array.from({length: maxRating}, (_, i) =>
                <Star key={i} fullColor={fullColor} size={size}
                      onRate={() => handleRating(i + 1)}
                      onHoverIn={() => setTempRating(i + 1)}
                      onHoverOut={() => setTempRating(0)}
                      full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
                />
           )}
         </div>
         <p style={textStyle}> {
           maxRating === messages.length
                ? messages[tempRating ? tempRating - 1 : rating - 1]
                : tempRating || rating || ''}</p>
       </div>
  );
}

function Star({onRate, full, fullColor, size, onHoverIn, onHoverOut}) {
  const startStyle = {
    width: `${size}px`, height: `${size}px`, cursor: 'pointer'
  }
  return (
       <span
            style={startStyle} role='button' onClick={onRate}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
       >
       {!full ? <svg
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke={fullColor}
            >
              <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   strokeWidth="{2}"
                   d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            : <svg
                 xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 20 20"
                 fill={fullColor}
                 stroke={fullColor}
            >
              <path
                   d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>}
       </span>

  )
}
export function Test() {
  const [movieRating, setMovieRating] = useState(0)

  return (
       <div>
         <StarRating maxRating={10} fullColor="blue" onSetRating={setMovieRating}/>
         <div>영화의 평점은 {movieRating} 입니다.</div>
       </div>
  )
}

export default StarRating;