import './index.css'
import Header from './Header';
import NewFrontPage from './NewFrontPage';

const Homepage = () => {
    
    return ( 
        <div className="homepage">
            <Header/>
            <NewFrontPage/>
        </div>
     );
}
 
export default Homepage;