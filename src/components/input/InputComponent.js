import './InputComponent.css';
import {forwardRef} from "react";


const InputComponent = forwardRef(({text, unit, onChange, options}, ref) => {

  return (
    <span className="InputComponent">
      <p>{text}</p>
      <input
        ref={ref}
        onChange={onChange}
        type={options?.type || 'number'}
        maxLength={options?.maxLength || ''}
        defaultValue={options?.defaultValue || ''}
      />
      {unit &&
        <p>{unit}</p>
      }
    </span>
  );
})

export default InputComponent;