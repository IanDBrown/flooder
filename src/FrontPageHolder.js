import { useState,useEffect } from "react"

const FrontPageHolder = (props) => {
    const [tideData, setTideData] = useState({})
    const [loaded, setLoaded] = useState(false)
    useEffect(()=>{
        const fetchTideData = async () =>{
            await fetch("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=20231109&range=48&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json")
            .then((res)=> res.json())
            .then((data)=> setTideData(data))
            setLoaded(true)
        }
        fetchTideData()
    },[])
    let highTide = [];
    let lowTide = [];

    if(loaded){
        tideData.predictions.map((extreme) => {
            let tideObj = {}
            tideObj["height"] = extreme.v
    
            function miltaryToTwelve(givenTime) {
                let date = givenTime.slice(5, 10)
                let hour = givenTime.slice(10, 13)
                let minute = givenTime.slice(13, 16)
    
                let AmOrPm = hour < 12 ? "AM" : "PM"
    
                if (hour === 0) hour = 12
                else if (hour > 12) {
                    hour = hour - 12
                    if (hour < 10) hour = " 0" + hour
                }
                return date + hour + minute + AmOrPm
            }
    
            tideObj["date"] = miltaryToTwelve(extreme.t)
            extreme.type === "L" ? lowTide.push(tideObj) : highTide.push(tideObj)
        })
    }
    if(!loaded){ return <p>Loading...</p>}
    else return (
        <div className="extreme-box">
            <div className="extremes-high extremes">
                <h4 className="tide-title">High Tide:</h4>
                <div className="tide-data">
                    {highTide.map((tide, n) => {
                        return (
                            <div key={n}>
                                <h4>{tide.date}</h4>
                                <h5>{tide.height} ft.</h5>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="extremes-low extremes">
                <h4 className="tide-title">Low Tide:</h4>
                <div className="tide-data">
                    {lowTide.map((tide, n) => {
                        return (
                            <div key={n} >
                                <h4>{tide.date}</h4>
                                <h5>{tide.height} ft.</h5>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default FrontPageHolder;