import PrevAndUpcomingTide from "./comps/PrevAndUpcomingTide";
import useFetch from "./useFetch"
import DailyExtremeList from "./comps/DailyExtremeList";
import Popup from "./comps/Popup";

const FrontPageHolder = () => {
    const date = new Date();
    let offset = -300;
    let yesterdaysDate =  new Date((date.getTime() -86400000) + offset*60*1000).toJSON().slice(0,10).replace(/-/g,'')
    const { loaded: predictionTideLoaded, data: tideData } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${yesterdaysDate}&range=72&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`)
    const { loaded: currentTideLoaded, data: currentTideLevel } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8551910&product=water_level&datum=MLLW&time_zone=gmt&units=english&application=DataAPI_Sample&format=json`)
    
    let datetime =  date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
    + " " + date.getHours()
    + ":" + (date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes())

    let upComingTide = null
    let previousTide = null
    let tideByDay = []

    function UtcDate(date){
        let givenDate = new Date(date)
        let now_utc = Date.UTC(givenDate.getUTCFullYear(), givenDate.getUTCMonth(),
            givenDate.getUTCDate(), givenDate.getUTCHours(),
            givenDate.getUTCMinutes(), givenDate.getUTCSeconds());
        return now_utc
    }  

    function closestExtreme(upComingExtreme, prevExtreme){
        let currentTimeUTC = UtcDate(datetime)
        let upComingExtremeDiff = Math.abs(currentTimeUTC - UtcDate(upComingExtreme))
        let prevExtremeDiff = Math.abs(currentTimeUTC - UtcDate(prevExtreme))
        if(upComingExtremeDiff > prevExtremeDiff){
            return previousTide
        }else{
            return upComingTide
        }
    }

    function changePopup(display){
        document.querySelector(".pop-up").style.display = display
        document.querySelector(".overlay").style.display = display
    }

    function getUpComingTide(){
        return upComingTide
    }

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

    function findUpcomingTide(extreme, index){
        let currDate = UtcDate(datetime)
        let givenDate = UtcDate(extreme.t)
        if(currDate < givenDate && upComingTide === null){
            console.log(datetime + " " + extreme.t)
            // upComingTide = {...extreme, formatTime:miltaryToTwelve(extreme.t)}
            upComingTide = index;
            // previousTide = {...tideData.predictions[index-1], formatTime:miltaryToTwelve(tideData.predictions[index-1].t)}
        } 
        
        
        let prevDate = ""
        let dateArray = []
        
        tideData.predictions.map((extreme, n) => {
            let tideObj = {}
            findUpcomingTide(extreme, n)
            tideObj["height"] = extreme.v
            tideObj["date"] = miltaryToTwelve(extreme.t)
            tideObj["type"] = extreme.type
            
            let tideDate = tideObj["date"].split(" ")
            
            if(prevDate === ""){
                prevDate = tideDate[0]
                dateArray.push(tideObj)
            }
            else if(prevDate === tideDate[0]){
                dateArray.push(tideObj)
                if(n === (tideData.predictions.length -1)){
                    tideByDay.push(dateArray) 
                }
            }else if(prevDate !== tideDate[0]){
                tideByDay.push(dateArray)
                dateArray = []
                dateArray.push(tideObj)
                prevDate = tideDate[0]
            }
        })
    }
    if(!predictionTideLoaded || !currentTideLoaded || !tideData){ return <p>Loading...</p>}
    else return (
        <div className="container">
            <div className="overlay"></div>
            <Popup datetime = {datetime} waterLevel = {currentTideLevel.data[0].v} closestTide = {""} />
            <div className="current-tide">
                <h4 className="tide-title">Current Tide</h4>
                <h2>{currentTideLevel.data[0].v} ft.</h2>
            </div>
                <div className="prev-next-tide">
                    <div className="currentBox">
                        <h4 className="tide-title">previousTide<br></br>Tide</h4>
                        <h1>{tideData.predictions[upComingTide].type === "H" ? "High Tide" : "Low Tide"}</h1>
                        <h3><b>{tideData.predictions[upComingTide].v}</b> ft. at</h3>
                        <h3>{tideData.predictions[upComingTide].t}</h3>
                    </div>
                    {/* <PrevAndUpcomingTide tide = {previousTide} typeOfTide = {"Previous"}/>
                    <PrevAndUpcomingTide tide = {upComingTide} typeOfTide = {"Upcoming"}/> */}
                </div>
            <DailyExtremeList tideByDay = {tideByDay}/>
            <div className="footer">
                <div>
                    <button id = "reportWaterLevel" className="report-button" onClick={()=> changePopup("block")}>Report Water Level</button>
                </div>
            </div>
        </div>
    );
}

export default FrontPageHolder;