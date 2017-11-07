import React from 'react';

function SvgIcon(props) {
  const { children, className, viewBox, ...other } = props;

  return (
    <svg
      className={className}
      focusable="false"
      viewBox={viewBox}

      {...other}
    >
      {children}
    </svg>
  );
}

SvgIcon.defaultProps = {
  viewBox: '0 0 24 24',
  style: {
    height: '24px',
    width: '24px',
    userSelect: 'none'
  }
};

export default SvgIcon;
