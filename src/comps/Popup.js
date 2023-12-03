import { useCallback } from "react";
import {app} from '../firebase-config';
import { getFirestore } from '@firebase/firestore'
import {addDoc, collection} from 'firebase/firestore'

const Popup = (props) => {
    const db = getFirestore(app)

    function changePopup(display){
        document.querySelector(".pop-up").style.display = display
        document.querySelector(".overlay").style.display = display
    }

    const writeDB = async (results) => {
        const waterRef = collection(db, "waterOnBridge")
        await addDoc(waterRef, results)
        changePopup("none")
      }

    const alertResults = useCallback((data) => {
        writeDB(data)
      }, []);   
    
    function waterDatabase(waterOnBridge, datetime, waterLevel, closestTide){
        let tideData = {"waterOnBridge": waterOnBridge, "date": datetime, "waterLevel": waterLevel, "closestTide": closestTide}
        alertResults(tideData)
    }

    return ( 
        <div className="button-div pop-up">
            <span className="close cursor" onClick={()=> changePopup("none")}>&times;</span>
            <h2>Was there water on the bridge?</h2>
            <button id = "YesWaterButton" onClick={()=> waterDatabase(true, props.datetime, props.waterLevel, props.closestTide)}>Yes</button>
            <button id = "NoWaterButton" onClick={()=> waterDatabase(false, props.datetime, props.waterLevel, props.closestTide)}>No</button>
        </div>
     );
}
 
export default Popup;
