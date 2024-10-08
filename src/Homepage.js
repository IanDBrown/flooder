import './index.css'
import Header from './Header';
import NewFrontPage from './NewFrontPage';
import Footer from './Footer';
const Homepage = () => {
    
    return ( 
        <div className="homepage">
            <Header/>
            <NewFrontPage/>
        </div>
     );
}
 
export default Homepage;