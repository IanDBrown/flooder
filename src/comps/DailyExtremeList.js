const DailyExtremeList = (props) => {
    return(
        <div className="extreme-box">
            {props.tideByDay.map((dateArray, n)=>{
                let date = dateArray[0].date.split(" ")
                return(
                    <div key={n} className="tide-by-day">
                        <h4 className="tide-title">{date[0]}</h4>
                        <div className="all-tide-day">
                            {dateArray.map((tideObj, n)=>{
                                return(
                                    <div key={n} className="extreme-values">
                                        <h4>{tideObj.date.slice(6,13)}</h4>
                                        <h4> <b>{tideObj.height} ft.</b></h4>
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