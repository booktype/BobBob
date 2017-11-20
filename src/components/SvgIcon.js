import React from 'react';

function SvgIcon(props) {
  const { children, className, style, ...other } = props;
  const viewBox = `0 0 ${style.width} ${style.height}`;
  return (
    <svg
      className={className}
      focusable="false"
      viewBox={viewBox}
      style={style}
      width={style.width}
      height={style.height}
      {...other}
    >
      <props.children.type {...children.props} fill={other.color} />
    </svg>
  );
}

SvgIcon.defaultProps = {
  style: {
    height: 24,
    width: 24,
    userSelect: 'none'
  }
};

export default SvgIcon;
