import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";

const HourlyBox = (props) => {
    return ( 
        <div className='hourly-box homepage-box'>
            <div className="extremes-high">
                {props.tideData.heights.map((tide, n)=>{
                    let date = new Date(tide.timestamp*1000);
                    let printDate = (date.getHours())
                    let height = tide.height.toFixed(3)
                    let arrow;

                    if(tide.state === "FALLING"){
                        arrow = <FaArrowDown/>
                    }else{
                        arrow = <FaArrowUp/>
                    }

                    if(printDate === 12) printDate = printDate + " pm"
                    if(printDate === 0) printDate = (printDate +12) + " am"
                    else if(printDate < 12) printDate = printDate + " am"
                    else if(printDate > 12) printDate = (printDate -12)  + " pm"
                    
                    return( 
                        <div key={n} className="hour-box">
                            <p>{printDate}</p>
                            <p>{height}</p>
                            <p>{arrow}</p>
                        </div>
                    )
                })}
            </div>
        </div>
     );
}
 
export default HourlyBox;