import { useState } from "react";

const Wave = (props) => {
    let waveInterval;
    var percent = 0;
    let currentTide = props.currentTide;

    const moveWave = (percentage, water) => {
        if (percent > percentage) {
            clearInterval(waveInterval);
        }

        water.style.transform='translate(0'+','+(100-percent)+'%)';
        percent += 1;
    }

    setTimeout(() => {
        var water=document.getElementById("water");
        var interval;
        var upOrDown = 1;
        let percentage;

        if (currentTide) {
            percentage = props?.currentTide / 8 * 100;
        }

        water.style.transform='translate(0'+','+(100)+'%)';

        waveInterval = setInterval(() => moveWave(percentage, water), 60);

        // interval=setInterval(function(){ 
        //     percent = percent + 1 * upOrDown; 
        //     water.style.transform='translate(0'+','+(100-percent)+'%)';
        //     if(percent>99){ 
        //         upOrDown = -1;
        //     } 
        //     if(percent === 0){
        //         upOrDown = 1;
        //     }
        // },60);
    }, 0);
   
    return ( 
        <div>
            <svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink" x="0px" y="0px" style= {{display: "none"}}>
                <symbol id="wave">
                    <path d="M420,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C514,6.5,518,4.7,528.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H420z"></path>
                    <path d="M420,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C326,6.5,322,4.7,311.5,2.7C304.3,1.4,293.6-0.1,280,0c0,0,0,0,0,0v20H420z"></path>
                    <path d="M140,20c21.5-0.4,38.8-2.5,51.1-4.5c13.4-2.2,26.5-5.2,27.3-5.4C234,6.5,238,4.7,248.5,2.7c7.1-1.3,17.9-2.8,31.5-2.7c0,0,0,0,0,0v20H140z"></path>
                    <path d="M140,20c-21.5-0.4-38.8-2.5-51.1-4.5c-13.4-2.2-26.5-5.2-27.3-5.4C46,6.5,42,4.7,31.5,2.7C24.3,1.4,13.6-0.1,0,0c0,0,0,0,0,0l0,20H140z"></path>
                </symbol>
            </svg>

<div class="water-jar">
  <div id="water" class="water">
    <svg viewBox="0 0 560 20" class="water_wave water_wave_back">
      <use xlinkHref="#wave"></use>
    </svg>
    <svg viewBox="0 0 560 20" class="water_wave water_wave_front">
      <use xlinkHref="#wave"></use>
        </svg>
        </div>
    </div>
</div>
     );
}
 
export default Wave;