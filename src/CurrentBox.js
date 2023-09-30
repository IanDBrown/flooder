const CurrentBox = (props) => {
    let highTide= [];
    let lowTide = [];

    props.tideData.extremes.map((extreme)=>{
        let tideObj = {}
        let date = new Date(extreme.timestamp*1000);
        let printDate = (date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        tideObj["height"] = extreme.height.toFixed(3)
        tideObj["date"] = printDate
        if(extreme.state === "LOW TIDE"){
            lowTide.push(tideObj)
        }else{
            highTide.push(tideObj)
        }
    })
    return ( 
        <div className='current-box homepage-box'>
            <h3>Location</h3>
            <h1>{props.tideData.heights[0].height.toFixed(3)}</h1>
            <div className="extreme-box">
                <h4>High Tide:</h4>
                <div className="extremes-high">
                    {highTide.map((tide, n)=>{
                        return <h4 key = {n}>{`${tide.height} at ${tide.date}`}</h4>
                    })}
                </div>
            </div>
        </div>
     );
}
 
export default CurrentBox;