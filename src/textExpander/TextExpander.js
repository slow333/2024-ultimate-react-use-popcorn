import "./styles.css";
import {useState} from "react";
function TextExpander() {
  return (
       <div className="container">
         <ExpandComponent>
           Space travel is the ultimate adventure! Imagine soaring past the stars
           and exploring new worlds. It's the stuff of dreams and science fiction,
           but believe it or not, space travel is a real thing. Humans and robots
           are constantly venturing out into the cosmos to uncover its secrets and
           push the boundaries of what's possible.
         </ExpandComponent>

         <ExpandComponent
              collapsedNumWords={20}
              ExpandComponentButtonText="Show text"
              collapseButtonText="Collapse text"
              buttonColor="#ff6622"
         >
           Space travel requires some seriously amazing technology and
           collaboration between countries, private companies, and international
           space organizations. And while it's not always easy (or cheap), the
           results are out of this world. Think about the first time humans stepped
           foot on the moon or when rovers were sent to roam around on Mars.
         </ExpandComponent>

         <ExpandComponent expand={true} className="box">
           Space missions have given us incredible insights into our universe and
           have inspired future generations to keep reaching for the stars. Space
           travel is a pretty cool thing to think about. Who knows what we'll
           discover next!
         </ExpandComponent>
       </div>
  );
}

function ExpandComponent({
  children,
  className,
  ExpandButtonText = "Show more",
  collapseButtonText = "Close",
  buttonColor,
  expand
}) {
  const [isOpen, setIsOpen] = useState(expand);

  const btnStyle = {
    color: `${buttonColor && "red"}` ,
    cursor: 'pointer'
  }
  return (
       <div className={`wrapper ${className}`}>
         <span className={`${!isOpen && "mask"}`}>{children}</span>

         <span
              className="button"
              role="button"
              onClick={() => setIsOpen((isOpen) => !isOpen)}
              style={btnStyle}
         >
        {isOpen ? collapseButtonText : ExpandButtonText}
      </span>
       </div>
  );
}

export default TextExpander;