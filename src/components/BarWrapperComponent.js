import './StatsComponent.css';
import {Bar} from "react-chartjs-2";


const StatsComponent = ({title, data, yLabel}) => {

  return (
    <Bar
      data={data}
      options={{
        title:{
          display: true,
          text: title,
          fontSize: 20
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: yLabel
            }
          }]
        },
        legend:{
          display: true,
          position: 'right'
        }
      }}
    />
  );
}

export default StatsComponent;