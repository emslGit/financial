import './AddExtrasComponent.css';
import {useRef} from "react";


const AddExtrasComponent = ({addExtra, currency}) => {
  const todayYear = new Date().getFullYear()
  const eventRef = useRef(null)
  const firstRef = useRef(null)
  const lastRef = useRef(null)
  const firstImpactRef = useRef(null)
  const lastImpactRef = useRef(null)
  const annualRef = useRef(null)

  const createExtra = () => {
    const name = eventRef.current?.value
    const first = parseInt(firstRef.current?.value)
    const last = parseInt(lastRef.current?.value || first)

    if (!name) {
      eventRef.current.focus()
    } else if (first < todayYear) {
      firstRef.current.focus()
    } else if (last < first) {
      lastRef.current.focus()
    } else {
      const range = []
      for (let i = first; i <= last; i++) {
        range.push(i);
      }

      const newExtra = {
        id: Math.floor(Math.random() * 10000),
        name: eventRef.current?.value,
        period: range,
        first: parseFloat(firstImpactRef.current?.value) || 0,
        last: parseFloat(lastImpactRef.current?.value) || 0,
        annual: parseFloat(annualRef.current?.value) || 0
      }

      eventRef.current.value = ''
      firstRef.current.value = ''
      lastRef.current.value = ''
      firstImpactRef.current.value = ''
      lastImpactRef.current.value = ''
      annualRef.current.value = ''

      return newExtra
    }
  }

  return (
    <div className="AddExtrasComponent flex-cols">
      <span>
        <span>
          <p>Name of event: </p>
          <input ref={eventRef} type="text"/>
        </span>
        <span>
          <p>Starting anno: </p>
          <input ref={firstRef} type="number"/>
        </span>
        <span>
          <p>Ending anno: </p>
          <input ref={lastRef} type="number"/>
        </span>
      </span>
      <span>
        <span>
          <p>Initial impact: </p>
          <span>
            <input ref={firstImpactRef} type="number"/>
            <p>{currency}</p>
          </span>
        </span>
        <span>
          <p>Final impact: </p>
          <span>
            <input ref={lastImpactRef} type="number"/>
            <p>{currency}</p>
          </span>
        </span>
        <span>
          <p>Annual impact: </p>
          <span>
            <input ref={annualRef} type="number"/>
            <p>{currency}</p>
          </span>
        </span>
      </span>
      <button onClick={() => addExtra(createExtra())}>Add Event</button>
    </div>
  );
}

export default AddExtrasComponent;