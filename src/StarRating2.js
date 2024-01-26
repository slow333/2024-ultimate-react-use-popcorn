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
         {!full ?
              <svg height={size} width={size}>
                <polygon points="100,10 40,198 190,78 10,78 160,198"
                         style={{fill: fullColor, stroke: "", strokeWidth:"5",
                           fillRule:"nonzero"}}/>
                Sorry, your browser does not support inline SVG.
              </svg> :
              <svg height={size} width={size}>
                <polygon points="100,10 40,198 190,78 10,78 160,198"
                         style={{
                           fill: "none", stroke: "", strokeWidth: "5",
                           fillRule: "nonzero"
                         }}/>
                Sorry, your browser does not support inline SVG.
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