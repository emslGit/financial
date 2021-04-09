import './SettingsComponent.css';
import InputComponent from "../input/InputComponent";
import {useRef, useContext, useEffect} from "react";
import {SettingsContext} from "../../SettingsContext";


export const SettingsComponent = () => {
  const {settings, setSettings} = useContext(SettingsContext)
  const inputIterations = useRef(null)
  const inputPrecision = useRef(null)
  const selectCurrency = useRef(null)

  useEffect(() => {
    updateSettings()
  }, [])

  const updateSettings = () => {
    setSettings({
      iterations: inputIterations.current?.value,
      precision: inputPrecision.current?.value,
      currency: selectCurrency.current?.value,
    })
  }

  return (
    <span className="SettingsComponent">
      <InputComponent text="Iterations:"
                      onChange={updateSettings}
                      ref={inputIterations}
                      options={{type: 'text', maxLength: 6, defaultValue: 1000}}/>
      <InputComponent text="Precision:"
                      onChange={updateSettings}
                      ref={inputPrecision}
                      options={{type: 'text', maxLength: 3, defaultValue: 2}}/>
      <span className="flex-center">
        <p>Currency:</p>
        <select ref={selectCurrency} onChange={updateSettings}>
          <option value="SEK">SEK</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </span>
    </span>
  );
}

export default SettingsComponent;