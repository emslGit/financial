import './InputComponent.css';
import {forwardRef} from "react";


const InputComponent = forwardRef(({text, unit, options}, ref) => {

  return (
    <span className="InputComponent">
      <p>{text}</p>
      <input
        ref={ref}
        type={options?.type || 'number'}
        maxLength={options?.maxLength || ''}
        defaultValue={options?.defaultValue || ''}
      />
      <p>{unit}</p>
    </span>
  );
})

export default InputComponent;