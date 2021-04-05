import {Bar, Line} from "react-chartjs-2";
import './ChartWrapperComponent.css';


const ChartWrapperComponent = ({type, title, data, xLabel, yLabel, legend}) => {
  const options = {
    title:{
      display: true,
        text: title,
        fontSize: 20
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: xLabel,
          labelString: xLabel
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: yLabel,
          labelString: yLabel
        }
      }]
    },
    legend:{
      display: legend,
        position: 'bottom'
    }
  }

  return (
    <div className="ChartWrapperComponent">
      {(type === 'bar') && <Bar data={data} options={options} />}
      {(type === 'line') && <Line data={data} options={options} />}
    </div>
  );
}

export default ChartWrapperComponent;