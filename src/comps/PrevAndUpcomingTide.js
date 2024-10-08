import moment from "moment";

const PrevAndUpcomingTide = (props) => {
    if(props.tide === null) return (<p>Loading Still...</p>)
    return ( 
        <div className={`currentBox ${props.typeOfTide}`}>
            <p>{props.tide.type === "H" ? "↑" : "↓"}</p>
            <p>{props.tide.v}'</p>
            <p>{moment(props.tide.t).format("LT")}</p>
            <div style={{position: "absolute", bottom:'-90px', left:0, right:0, height: 90, background: "linear-gradient(#7ca6d5, transparent)"}}>
            </div>
        </div>
     );
}
 
export default PrevAndUpcomingTide;