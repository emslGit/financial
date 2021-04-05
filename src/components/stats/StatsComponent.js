import './StatsComponent.css';


const StatsComponent = ({text, stat}) => {

  return (
    <span className="StatsComponent">
      <p><b>{text}</b></p>
      <p>{stat[0].toLocaleString().replaceAll(',', ' ') + ' ' + stat[1]}</p>
    </span>
  );
}

export default StatsComponent;