import {useState, forwardRef, useImperativeHandle, useRef} from 'react'
import './TaxComponent.css';


const TaxComponent = forwardRef((props, ref) => {
  const radioRef = useRef(null)
  const seRef = useRef(null)
  const fixRef = useRef(null)
  const [radio, setRadio] = useState("se")

  useImperativeHandle(ref, () => ({
    get input() {
      return fixRef.current
    },
    get radio() {
      return radioRef.current
    }
  }))

  return (
    <span className="TaxComponent">
      <p>Income tax:</p>
      <span>
        <p>SE</p>
        <input ref={seRef} onChange={() => setRadio('se')} type="radio" id="se" name="se" value='se' checked={radio === "se"}/>
      </span>
      <span>
        <p>Fix</p>
        <input ref={radioRef} onChange={() => setRadio('fix')} type="radio" id="fix" name="fix" value='fix' checked={radio === "fix"}/>
        <input ref={fixRef} type="percent" defaultValue="0" disabled={radio === "se"}/>
        <p>%</p>
      </span>
    </span>
  )
})

export default TaxComponent