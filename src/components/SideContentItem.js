import React from 'react';

const styles = {
  activeItem: {
    "boxShadow": "0 5px 11px 0 rgba(0,0,0,0.18), 0 4px 15px 0 rgba(0,0,0,0.15)",
    marginLeft: -30,
    zIndex: 1000,
    "transition": "margin-left 0.35s cubic-bezier(0.4, 0, 1, 1) transform(-40px)"
  },
  inactiveItem: {
    "boxShadow": "0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)",
    // "margin": "0 24px",
    minWidth: 42,
    minHeight: 42,
    "transition": "margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "listStyleType": "none"
  },
  itemHeader: {
    "display": "block",
    "cursor": "pointer",
    "minHeight": "3rem",
    "lineHeight": "3rem",
    "padding": "0 1rem",
    "backgroundColor": "#fff",
    "borderBottom": "1px solid #ddd",
    "listStyleType": "none"
  },
  activeItemBody: {
    "display": "block",
    "borderBottom": "1px solid #ddd",
    "boxSizing": "border-box",
    // "padding": "2rem",
    "backgroundColor": "white"
  },
  inactiveItemBody:{
    "display": "none"
  }
}

const SideContentItem = (props) => {
  if (!props.active) {
    return (
      <li onClick={props.onClick} style={{...styles.inactiveItem, marginTop: props.position, position: "absolute"}}>
        <div style={styles.itemHeader}>
          <props.header active={false} />
        </div>
      </li>
    )
  }else{
    return (
      <li style={{...styles.activeItem, top: props.position+40, position: "absolute"}}>
        <div onClick={props.onClick} style={styles.itemHeader}>
          <props.header active={true} />
        </div>
        <div style={styles.activeItemBody}>
          <props.body active={true} />
        </div>
      </li>
    )
  }
}

export default SideContentItem;
