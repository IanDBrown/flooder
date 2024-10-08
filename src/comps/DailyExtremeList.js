import moment from 'moment';
const DailyExtremeList = (props) => {
    return(
        <div className="extreme-box">
            {props.tideByDay.map((dateArray, n)=>{
                return(
                    <div key={n} className="tide-by-day">
                        <div className='date-header'>
                            <h2 className='tide-time'>{moment(dateArray[0].t).calendar().split(" ")[0]}</h2>
                            <h4 className='tide-time'>{moment(dateArray[0].t).format("MMM DD")}</h4>
                        </div>
                        <div className="all-tide-day">
                            {dateArray.map((tideObj, n)=>{
                                return(
                                    <div key={n} className="extreme-values">
                                        <h4 className='extreme-type'>{tideObj.type === "L" ? "↓   Low" : "↓   High"}</h4>
                                        <h4 className='extreme-time'>{moment(tideObj.t).format("LT")}</h4>
                                        <h4 className='extreme-value'>{tideObj.v} ft.</h4>
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