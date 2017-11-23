import React from 'react';

export default function TextField({
  value,
  type='text',
  hintText,
  label,
  onChange,
  onKeyPress,
  inputRef
}) {
  return (
    <div >
      {label?
        <label className="f6 b db mb2">
          {label} 
      </label>:null}
      <input 
        ref={inputRef}
        className="input-reset ba b--black-20 pa2 mb2 db w-100"
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        onKeyPress={onKeyPress}
      />
      {hintText?
        <small className="f6 black-60 db mb2">
          {hintText}
        </small>
      :null}
    </div>
  );
}