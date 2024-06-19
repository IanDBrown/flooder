import moment from 'moment';
const DailyExtremeList = (props) => {
    console.log(props.tideByDay);
    return(
        <div className="extreme-box">
            {props.tideByDay.map((dateArray, n)=>{
                return(
                    <div key={n} className="tide-by-day">
                        <h4 className="tide-title">{moment(dateArray[0].t).format("MM-DD")}</h4>
                        <div className="all-tide-day">
                            {dateArray.map((tideObj, n)=>{
                                return(
                                    <div key={n} className="extreme-values">
                                        <h4>{moment(tideObj.t).format("LT")}</h4>
                                        <h4> <b>{tideObj.v} ft.</b></h4>
                                        <h4>{tideObj.type === "L" ? "Low" : "High"}</h4>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}
 
export default DailyExtremeList;