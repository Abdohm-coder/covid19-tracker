import "./InfoBox.css";

function InfoBox({ active, title, cases, isRed, color, ...props }) {
  return (
  <div
   className={`infoBox ${active && "infoBox--selected"} infoBox--${color}`} 
   onClick={props.onClick}
  >
      <div className="infoBox__container">
          <h2 className={`infoBox__cases`}>{cases}</h2>
          <h3 className="infoBox__title" color="textSecondary">
              {title}
          </h3>
      </div>
  </div>
  );
}

export default InfoBox;
