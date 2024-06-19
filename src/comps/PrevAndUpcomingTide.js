import moment from "moment";

const PrevAndUpcomingTide = (props) => {
    if(props.tide === null) return (<p>Loading Still...</p>)
    return ( 
        <div className="currentBox">
            <h4 className="tide-title">{props.typeOfTide}<br></br>Tide</h4>
            <h1>{props.tide.type === "H" ? "High Tide" : "Low Tide"}</h1>
            <h3><b>{props.tide.v}</b> ft. at</h3>
            <h3>{moment(props.tide.t).format("LT")}</h3>
        </div>
     );
}
 
export default PrevAndUpcomingTide;