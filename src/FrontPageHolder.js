import ExtremeList from "./comps/ExtremeList";
import PrevAndUpcomingTide from "./comps/PrevAndUpcomingTide";
import useFetch from "./useFetch"
import { useCallback } from "react";
import {app} from './firebase-config';
import { getFirestore } from '@firebase/firestore'
import {addDoc, collection} from 'firebase/firestore'

const FrontPageHolder = () => {
    const db = getFirestore(app)

    const date = new Date();
    let offset = -300;
    let yesterdaysDate =  new Date((date.getTime() -86400000) + offset*60*1000).toJSON().slice(0,10).replace(/-/g,'')
    const { loaded: predictionTideLoaded, data: tideData } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${yesterdaysDate}&range=72&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`)
    const { loaded: currentTideLoaded, data: currentTideLevel } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8551910&product=water_level&datum=MLLW&time_zone=gmt&units=english&application=DataAPI_Sample&format=json`)
    
    let datetime =  date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
    + " " + date.getHours()
    + ":" + (date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes())

    let highTide = []
    let lowTide = []
    let upComingTide = []
    let previousTide = []
    let tideByDay = []

    function UtcDate(date){
        let givenDate = new Date(date)
        let now_utc = Date.UTC(givenDate.getUTCFullYear(), givenDate.getUTCMonth(),
            givenDate.getUTCDate(), givenDate.getUTCHours(),
            givenDate.getUTCMinutes(), givenDate.getUTCSeconds());
        return now_utc
    }

    const writeDB = async (results) => {
        const waterRef = collection(db, "waterOnBridge")
        await addDoc(waterRef, results)
        changePopup("none")
        //hide buttons after/show success pop up
      }

    const alertResults = useCallback((data) => {
        writeDB(data)
      }, []);     

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

    function waterDatabase(waterOnBridge){
        let tideData = {"waterOnBridge": waterOnBridge, "date": datetime, "waterLevel": currentTideLevel.data[0].v, "closestTide": closestExtreme(upComingTide[3], previousTide[3])}
        alertResults(tideData)
    }

    function changePopup(display){
        document.querySelector(".pop-up").style.display = display
        document.querySelector(".overlay").style.display = display
    }

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
        
        function definePreviousTide(tide){
            [previousTide[0], previousTide[1], previousTide[2], previousTide[3]] = [miltaryToTwelve(tide.t), tide.v, tide.type, tide.t]
        }

        function findUpcomingTide(givenTime, tideType, height, index){
            let currDate = UtcDate(datetime)
            let givenDate = UtcDate(givenTime)
            if(currDate < givenDate && upComingTide.length === 0){
                [upComingTide[0], upComingTide[1], upComingTide[2], upComingTide[3]] = [miltaryToTwelve(givenTime), height, tideType, givenTime]
                definePreviousTide(tideData.predictions[index-1])
            } 
        }
        let prevDate = ""
        let dateArray = []
        tideData.predictions.map((extreme, n) => {
            let tideObj = {}
            findUpcomingTide(extreme.t, extreme.type, extreme.v, n)
            tideObj["height"] = extreme.v
            tideObj["date"] = miltaryToTwelve(extreme.t)
            tideObj["type"] = extreme.type
            extreme.type === "L" ? lowTide.push(tideObj) : highTide.push(tideObj)

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
        console.log(tideByDay)
    }
    if(!predictionTideLoaded || !currentTideLoaded){ return <p>Loading...</p>}
    else return (
        <div className="container">
            <div className="overlay"></div>
            <div className="button-div pop-up">
                <span className="close cursor" onClick={()=> changePopup("none")}>&times;</span>
                <h2>Was there water on the bridge?</h2>
                <button id = "YesWaterButton" onClick={()=> waterDatabase(true)}>Yes</button>
                <button id = "NoWaterButton" onClick={()=> waterDatabase(false)}>No</button>
            </div>
            <div className="current-tide">
                <h4 className="tide-title">Current Tide</h4>
                <h2>{currentTideLevel.data[0].v} ft.</h2>
            </div>
            <div className="prev-next-tide">
                <PrevAndUpcomingTide tide = {previousTide} typeOfTide = {"Previous"}/>
                <PrevAndUpcomingTide tide = {upComingTide} typeOfTide = {"Upcoming"}/>
            </div>            
            {/* <div className="extreme-box">
                <ExtremeList tideData = {highTide} typeOfTide = {"High"}/>
                <ExtremeList tideData = {lowTide} typeOfTide = {"Low"}/>
            </div> */}
            <div className="extreme-box">
                {tideByDay.map((dateArray)=>{
                    let date = dateArray[0].date.split(" ")
                    return(
                        <div className="tide-by-day">
                            <h4 className="tide-title">{date[0]}</h4>
                            <div className="all-tide-day">
                                {dateArray.map((tideObj, n)=>{
                                    return(
                                        <div key={n} className="extreme-values">
                                            <h4>{tideObj.date.slice(6,13)}</h4>
                                            <h4> <b>{tideObj.height} ft.</b></h4>
                                            <h4>{tideObj.type}</h4>
                                        </div>
                                    )
                                })}
                            </div>

                        </div>
                    )
                })}
            </div>
            <div className="footer">
                <div>
                    <button id = "reportWaterLevel" className="report-button" onClick={()=> changePopup("block")}>Report Water Level</button>
                </div>
            </div>
        </div>
    );
}

export default FrontPageHolder;