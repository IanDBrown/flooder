const ExtremeList = (props) => {
    return ( 
        <div className={`extremes-${props.typeOfTide} extremes`}>
            <h4 className="tide-title">{props.typeOfTide} Tide</h4>
            <div className="tide-data">
                {props.tideData.map((tide, n) => {
                    return (
                        <div key={n} className="extreme-values">
                            <h4> <b>{tide.height} ft.</b> at</h4>
                            <h4>{tide.date}</h4>
                        </div>
                    )
                })}
            </div>
        </div>
     );
}
 
export default ExtremeList;