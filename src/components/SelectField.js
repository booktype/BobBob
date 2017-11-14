import React from 'react';


export default function SelectField(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <label style={{display: 'block'}}>
        {props.label}
      </label>
      <select
        className={props.className}
        style={props.style}
        value={props.value}
        onChange={(e) => {
          e.preventDefault();
          props.onChange(e.target.value);
        }}
      >
        {props.children}
      </select>
    </div>
  );
}

export function Option(props) {
  return (
    <option
      style={props.style}
      className={props.className}
      value={props.value}
    >
      {props.primaryText}
    </option>
  );
}
