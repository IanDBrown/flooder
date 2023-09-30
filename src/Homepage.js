import CurrentBox from './CurrentBox';
import HourlyBox from './HourlyBox';
import WeeklyBox from './WeeklyBox';
import './index.css'
import tideJSON from './tideData'

const Homepage = () => {
    
    return ( 
        <div className="homepage">
            <CurrentBox tideData = {tideJSON}/>
            <HourlyBox tideData = {tideJSON}/>
            <WeeklyBox/>
        </div>
     );
}
 
export default Homepage;