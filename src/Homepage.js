import './index.css'
import FrontPageHolder from './FrontPageHolder';
import Header from './Header';

const Homepage = () => {
    
    return ( 
        <div className="homepage">
            <Header/>
            <FrontPageHolder/>
        </div>
     );
}
 
export default Homepage;