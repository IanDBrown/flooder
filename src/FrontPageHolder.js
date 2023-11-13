import { useState,useEffect } from "react"

const FrontPageHolder = (props) => {
    const [tideData, setTideData] = useState({})
    const [loaded, setLoaded] = useState(false)
    const date = new Date();
    let offset = -300;
    let todaysDate =  new Date((date.getTime() -86400000) + offset*60*1000).toJSON().slice(0,10).replace(/-/g,'')
    useEffect(()=>{
        const fetchTideData = async () =>{
            await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${todaysDate}&range=72&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`)
            .then((res)=> res.json())
            .then((data)=> setTideData(data))
            setLoaded(true)
        }
        fetchTideData()
    },[todaysDate])

    let highTide = [];
    let lowTide = [];
    let upComingTide = [];
    let previousTide = []
    if(loaded){
        function spliceTime(givenTime){
            let date = givenTime.slice(5, 10)
            let hour = givenTime.slice(10, 13)
            let minute = givenTime.slice(13, 16)
            return [date, hour, minute]
        }

        function miltaryToTwelve(givenTime) {
            let [date, hour, minute] = spliceTime(givenTime)

            let AmOrPm = hour < 12 ? "AM" : "PM"

            if (hour === 0) hour = 12
            else if (hour > 12) {
                hour = hour - 12
                if (hour < 10) hour = " 0" + hour
                else hour = " " + hour
            }
            return date + hour + minute + AmOrPm
        }

        let currentdate = new Date();
        let datetime =  currentdate.getFullYear() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getDate()
                        + " " + currentdate.getHours()
                        + ":" + (currentdate.getMinutes() < 10 ? "0"+ currentdate.getMinutes() : currentdate.getMinutes())


        function UtcDate(date){
            let givenDate = new Date(date)
            let now_utc = Date.UTC(givenDate.getUTCFullYear(), givenDate.getUTCMonth(),
                givenDate.getUTCDate(), givenDate.getUTCHours(),
                givenDate.getUTCMinutes(), givenDate.getUTCSeconds());
            return now_utc
        }
        
        function findUpcomingTide(givenTime, tideType, height, index){
            let currDate = UtcDate(datetime)
            let givenDate = UtcDate(givenTime)
            if(currDate < givenDate && upComingTide.length === 0){
                [upComingTide[0], upComingTide[1], upComingTide[2]] = [miltaryToTwelve(givenTime), height, tideType]
                // [previousTide[0], previousTide[1], previousTide[2]] = [miltaryToTwelve(tideData.predictions[index-1].t), tideData.predictions[index-1].v, tideData.predictions[index-1].type]
                previousTide[0] = miltaryToTwelve(tideData.predictions[index-1].t)
                previousTide[1] = tideData.predictions[index-1].v
                previousTide[2] = tideData.predictions[index-1].type
            } 
        }

        tideData.predictions.map((extreme, n) => {
            let tideObj = {}
            findUpcomingTide(extreme.t, extreme.type, extreme.v, n)
            tideObj["height"] = extreme.v
            tideObj["date"] = miltaryToTwelve(extreme.t)
            extreme.type === "L" ? lowTide.push(tideObj) : highTide.push(tideObj)
        })
        console.log(highTide)
    }
    if(!loaded){ return <p>Loading...</p>}
    else return (
        <div className="container">
            <div className="prev-next-tide">
                <div className="currentBox previous-tide">
                    <h4 className="tide-title">Previous Tide:</h4>
                    <h1>{previousTide[2] === "H" ? "High Tide" : "Low Tide"}</h1>
                    <h3>{previousTide[0]}</h3>
                    <h2>{previousTide[1]} ft.</h2>
                </div>
                <div className="currentBox upcoming-tide">
                    <h4 className="tide-title">Upcoming Tide:</h4>
                    <h1>{upComingTide[2] === "H" ? "High Tide" : "Low Tide"}</h1>
                    <h3>{upComingTide[0]}</h3>
                    <h2>{upComingTide[1]} ft.</h2>
                </div>
            </div>
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
        </div>
    );
}

export default FrontPageHolder;