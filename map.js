import * as Plotly from 'plotly.js-dist'
import timeAndXYData from './timeAndXY.json'
const TESTER = document.getElementById('tester');

const X_AXIS = [];
const Y_AXIS = [];

let dataIndex = 0;
let timeIntervals = [];

    function calculateIntervals() {
      const data = timeAndXYData;
  
      //Retrieve intervals
      for (let i = 2; i < data.length; i++) {
        const interval = data[i].time - data[i - 1].time;
        // console.log(interval);
        timeIntervals.push(interval * 60 * 1000);
      }
    }
  
    let timeIndex = 1;
  
    //Recurring function - render position at certain intervals
    function moveBoat() {
      const currentInterval = timeIntervals[timeIndex];
  
      // if (timeIndex < timeIntervals.length) {
      //   const data = timeAndXYData;
      //   const currentPosition = data[timeIndex];
      //   X_AXIS.push(currentPosition.X_Position);
      //   Y_AXIS.push(currentPosition.Y_Position);
      // }

      for (let i = 2; i < timeIntervals.length; i++) {
        const data = timeAndXYData;
        const currentPosition = data[timeIndex];
        X_AXIS.push(currentPosition.X_Position);
        Y_AXIS.push(currentPosition.Y_Position);
        timeIndex++;
      }


    }


    function pushData() {
        if (dataIndex < data.length) {
          const item = data[dataIndex];
          const xPosition = item["X_Position"];
          const yPosition = item["Y_Position"];
      
          X_AXIS.push(xPosition);
          Y_AXIS.push(yPosition);
          


          Plotly.newPlot( TESTER, [{

            x: X_AXIS,
            
            y: Y_AXIS }], {
            
            margin: { t: 1 } } );


          dataIndex++;
        } else {
          clearInterval(interval); // Stop the interval when all data is pushed.
        }
      }
  

calculateIntervals()
moveBoat()
Plotly.newPlot( TESTER, [{

  x: X_AXIS,
  
  y: Y_AXIS }], {
  
  margin: { t: 1 } } );
console.log(X_AXIS);
     


// setInterval(pushData, 100);