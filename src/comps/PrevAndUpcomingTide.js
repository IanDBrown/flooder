const PrevAndUpcomingTide = (props) => {
    return ( 
        <div className="currentBox">
            <h4 className="tide-title">{props.typeOfTide}<br></br>Tide</h4>
            <h1>{props.tide[2] === "H" ? "High Tide" : "Low Tide"}</h1>
            <h3><b>{props.tide[1]} ft.</b> at</h3>
            <h3>{props.tide[0]}</h3>
        </div>
     );
}
 
export default PrevAndUpcomingTide;