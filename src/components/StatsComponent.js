import './StatsComponent.css';


const StatsComponent = ({text, stat}) => {

  return (
    <span className="StatsComponent">
      <p>{text}</p>
      <p>{stat[0].toLocaleString() + ' ' + stat[1]}</p>
    </span>
  );
}

export default StatsComponent;