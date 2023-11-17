import ExtremeList from "./comps/ExtremeList";
import PrevAndUpcomingTide from "./comps/PrevAndUpcomingTide";
import useFetch from "./useFetch"

const FrontPageHolder = () => {
    const date = new Date();
    let offset = -300;
    let todaysDate =  new Date((date.getTime() -86400000) + offset*60*1000).toJSON().slice(0,10).replace(/-/g,'')
    const { loaded: predictionTideLoaded, data: tideData } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${todaysDate}&range=72&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`)
    const { loaded: currentTideLoaded, data: currentTideLevel } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8551910&product=water_level&datum=MLLW&time_zone=gmt&units=english&application=DataAPI_Sample&format=json`)

    let highTide = []
    let lowTide = []
    let upComingTide = []
    let previousTide = []
    if(predictionTideLoaded && currentTideLoaded){
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
    }
    console.log(currentTideLevel)
    if(!predictionTideLoaded && !currentTideLoaded || lowTide.length ===0 || highTide.length ===0){ return <p>Loading...</p>}
    else return (
        <div className="container">
            <div className="current-tide">
                <h4 className="tide-title">Current Tide:</h4>
                <h2>{currentTideLevel.data[0].v} ft.</h2>
            </div>
            <div className="prev-next-tide">
                <PrevAndUpcomingTide tide = {previousTide} typeOfTide = {"Previous"}/>
                <PrevAndUpcomingTide tide = {upComingTide} typeOfTide = {"Upcoming"}/>
            </div>
            <div className="extreme-box">
                <ExtremeList tideData = {highTide} typeOfTide = {"High"}/>
                <ExtremeList tideData = {lowTide} typeOfTide = {"Low"}/>
            </div>
        </div>
    );
}

export default FrontPageHolder;