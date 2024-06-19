import moment from 'moment';
import useFetch from "./useFetch"
import DailyExtremeList from './comps/DailyExtremeList';
import PrevAndUpcomingTide from './comps/PrevAndUpcomingTide';

const NewFrontPage = () => {
    let now = moment().subtract(1,"days").format("YYYYMMDD");
    const { loaded: predictionTideLoaded, data: tideData } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${now}&range=72&station=8551910&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=DataAPI_Sample&format=json`)
    const { loaded: currentTideLoaded, data: currentTideLevel } = useFetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=latest&station=8551910&product=water_level&datum=MLLW&time_zone=gmt&units=english&application=DataAPI_Sample&format=json`)

    if(!predictionTideLoaded || !currentTideLoaded){ return <p>Loading...</p>}
    else{
        //Loops to find closest extreme to the current time by using UNIX time.
        function findUpcomingTide(tideData){
            let currentUnixTime = moment().unix()
            let upcomingTideIndex;
            for(let x = 0; x < tideData.predictions.length; x++){
                let extremeUnixTime = moment(tideData.predictions[x].t).unix()
                if(extremeUnixTime > currentUnixTime){
                    upcomingTideIndex = x;
                    break;
                }
            }
            return upcomingTideIndex
        }

        function seperateExtremesByDay(tideData){
            let daySeperateDate = "";
            let dayTideList = [];
            let tidesByDay = [];
            tideData.predictions.map((extreme, n) => {
                let dayOfExtreme = moment(extreme.t).format("DD")
                //First day set the date then add to the list
                if(daySeperateDate === ""){
                    daySeperateDate = dayOfExtreme
                    dayTideList.push(extreme)
                } 
                //Same day add to the day list
                else if (dayOfExtreme === daySeperateDate){
                    dayTideList.push(extreme)
                    if(n === (tideData.predictions.length -1)){
                        tidesByDay.push(dayTideList) 
                    }
                }
                //First Day that doesn't match, push list to whole list then reset the day list and restart the loop
                else if(dayOfExtreme !== daySeperateDate){
                    tidesByDay.push(dayTideList)
                    dayTideList = []
                    dayTideList.push(extreme)
                    daySeperateDate = dayOfExtreme
                }
                return 0
            })
            return tidesByDay
        }

        return (
        <div className="container">
            <div className="overlay"></div>
            <div className="current-tide">
                <h4 className="tide-title">Current Tide</h4>
                <h2>{currentTideLevel.data[0].v} ft.</h2>
            </div>
                <div className="prev-next-tide">
                    <PrevAndUpcomingTide tide = {tideData.predictions[findUpcomingTide(tideData) - 1]} typeOfTide = {"Previous"}/>
                    <PrevAndUpcomingTide tide = {tideData.predictions[findUpcomingTide(tideData)]} typeOfTide = {"Upcoming"}/>
                </div>
            <DailyExtremeList tideByDay = {seperateExtremesByDay(tideData)}/>
            <div className="footer">

            </div>
        </div>
    );
    }
}
export default NewFrontPage;