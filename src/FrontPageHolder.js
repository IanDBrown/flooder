import ExtremeList from "./comps/ExtremeList";
import PrevAndUpcomingTide from "./comps/PrevAndUpcomingTide";
import useFetch from "./useFetch"
import { useCallback } from "react";
import {app} from './firebase-config';
import { getFirestore } from '@firebase/firestore'
import {addDoc, collection} from 'firebase/firestore'

//Created database to store current, closest tide and if there is water on bridge (Yes/No)

const FrontPageHolder = () => {
    const db = getFirestore(app)

    const date = new Date();
    let offset = -300;
    let yesterdaysDate =  new Date((date.getTime() -86400000) + offset*60*1000).toJSON().slice(0,10).replace(/-/g,'')
    const { loaded: predictionTideLoaded, data: tideData } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${yesterdaysDate}&range=72&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`)
    const { loaded: currentTideLoaded, data: currentTideLevel } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8551910&product=water_level&datum=MLLW&time_zone=gmt&units=english&application=DataAPI_Sample&format=json`)
    console.log(tideData)
    const writeDB = async (results) => {
        const waterRef = collection(db, "flooder")
        await addDoc(waterRef, { results })
        //hide buttons after/show success pop up
      }

    const alertResults = useCallback((data) => {
        console.log("alert")
        writeDB(data)
      }, []);     

    function waterDatabase(){
        //Create object to get stored
        alertResults({tideLeve: 6})
    }
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

        let datetime =  date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
                        + " " + date.getHours()
                        + ":" + (date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes())


        function UtcDate(date){
            let givenDate = new Date(date)
            let now_utc = Date.UTC(givenDate.getUTCFullYear(), givenDate.getUTCMonth(),
                givenDate.getUTCDate(), givenDate.getUTCHours(),
                givenDate.getUTCMinutes(), givenDate.getUTCSeconds());
            return now_utc
        }
        
        function definePreviousTide(tide){
            [previousTide[0], previousTide[1], previousTide[2]] = [miltaryToTwelve(tide.t), tide.v, tide.type]
        }

        function findUpcomingTide(givenTime, tideType, height, index){
            let currDate = UtcDate(datetime)
            let givenDate = UtcDate(givenTime)
            if(currDate < givenDate && upComingTide.length === 0){
                [upComingTide[0], upComingTide[1], upComingTide[2]] = [miltaryToTwelve(givenTime), height, tideType]
                definePreviousTide(tideData.predictions[index-1])
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
    if(!predictionTideLoaded || !currentTideLoaded){ return <p>Loading...</p>}
    else return (
        <div className="container">
            <div className="current-tide">
                <h4 className="tide-title">Current Tide</h4>
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
            <div className="button-div report">
                <button id = "reportWaterLevel" className="report-button">Report Water Level</button>
                <button id = "reportGui" className="report-button" onClick={()=> waterDatabase()}>Show Popup</button>
            </div>
            <div className="button-div popup">
                <h2>Was there water on the bridge?</h2>
                <button id = "YesWaterButton" onClick={()=> waterDatabase()}>Yes</button>
                <button id = "NoWaterButton" >No</button>
            </div>
        </div>
    );
}

export default FrontPageHolder;