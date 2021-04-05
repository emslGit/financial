import './ExtraComponent.css';


const ExtraComponent = ({extra, currency, removeExtra}) => {

  return (
    <div className="ExtraComponent flex-between">
      <span className="flex-cols">
        <b>{extra.name}</b>
        <p>
          {(extra.first > 0 ? ' Providing ' : 'Costing ') + extra.first.toLocaleString().replaceAll(',', ' ') + ' ' + currency} at year {extra.period[0]} and
          {(extra.annual > 0 ? ' providing ' : ' costing ') + extra.annual.toLocaleString().replaceAll(',', ' ') + ' ' + currency} every year until {extra.period[extra.period.length - 1]} where
          {' ' + extra.last.toLocaleString().replaceAll(',', ' ') + ' ' + currency} will be {(extra.last > 0 ? ' reimbursed.' : 'deducted.')}
        </p>
      </span>
      <span className="flex-center">
        <button className="x-button" onClick={() => removeExtra(extra.id)}>
          <div></div>
          <div></div>
        </button>
      </span>
    </div>
  );
}

export default ExtraComponent;