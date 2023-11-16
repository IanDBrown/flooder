// import CurrentBox from './CurrentBox';
// import HourlyBox from './HourlyBox';
// import WeeklyBox from './WeeklyBox';
import './index.css'
import FrontPageHolder from './FrontPageHolder';
import newTideData from './newTideData.json'
import Header from './Header';

const Homepage = () => {
    
    return ( 
        <div className="homepage">
            {/* <CurrentBox tideData = {tideJSON}/>
            <HourlyBox tideData = {tideJSON}/>
            <WeeklyBox/> */}
            <Header/>
            <FrontPageHolder tideData = {newTideData}/>
        </div>
     );
}
 
export default Homepage;