import CurrentBox from './CurrentBox';
import HourlyBox from './HourlyBox';
import WeeklyBox from './WeeklyBox';
import './index.css'
import tideJSON from './tideData'
import FrontPageHolder from './FrontPageHolder';
import newTideData from './newTideData.json'

const Homepage = () => {
    
    return ( 
        <div className="homepage">
            {/* <CurrentBox tideData = {tideJSON}/>
            <HourlyBox tideData = {tideJSON}/>
            <WeeklyBox/> */}
            <FrontPageHolder tideData = {newTideData}/>
        </div>
     );
}
 
export default Homepage;