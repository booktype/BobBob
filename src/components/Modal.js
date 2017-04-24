import React from 'react';

const styles = {
  overlayStyles: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    zIndex: '99',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dialogStyles: {
    width: '50%',
    height: '400px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-200px',
    marginLeft: '-25%',
    backgroundColor: '#fff',
    borderRadius: '2px',
    zIndex: '100',
    padding: '15px',
    boxShadow: '0px 0px 4px rgba(0,0,0,.14),0px 4px 8px rgba(0,0,0,.28)',
  },
  title: {
    marginTop: '0px',
  },
  closeButtonStyle: {
    cursor: 'pointer',
    position: 'absolute',
    fontSize: '1.8em',
    right: '10px',
    top: '0px',
  },
};

export default class SkyLightStateless extends React.Component {

  onOverlayClicked() {
    if (this.props.onOverlayClicked) {
      this.props.onOverlayClicked();
    }
  }

  onCloseClicked() {
    if (this.props.onCloseClicked) {
      this.props.onCloseClicked();
    }
  }

  render() {
    const mergeStyles = key => Object.assign({}, styles[key], this.props[key]);
    const { isVisible } = this.props;
    const dialogStyles = mergeStyles('dialogStyles');
    const overlayStyles = mergeStyles('overlayStyles');
    const closeButtonStyle = mergeStyles('closeButtonStyle');
    const titleStyle = mergeStyles('titleStyle');
    overlayStyles.display = dialogStyles.display = 'block';

    let overlay;
    if (this.props.showOverlay) {
      overlay = (
        <div className="skylight-overlay"
          onClick={() => this.onOverlayClicked()}
          style={overlayStyles}
        />
      );
    }

    return isVisible ? (
        <section className="skylight-wrapper">
            {overlay}
            <div className="skylight-dialog" style={dialogStyles}>
              <a role="button" className="skylight-close-button"
                onClick={() => this.onCloseClicked()}
                style={closeButtonStyle}
              >
                &times;
               </a>
              <h2 style={titleStyle}>{this.props.title}</h2>
              {this.props.children}
            </div>
        </section>
    ) : <div />;
  }
}

SkyLightStateless.displayName = 'SkyLightStateless';

// SkyLightStateless.sharedPropTypes = {
//   closeButtonStyle: React.PropTypes.object,
//   dialogStyles: React.PropTypes.object,
//   onCloseClicked: React.PropTypes.func,
//   onOverlayClicked: React.PropTypes.func,
//   overlayStyles: React.PropTypes.object,
//   showOverlay: React.PropTypes.bool,
//   title: React.PropTypes.string,
//   titleStyle: React.PropTypes.object,
// };

// SkyLightStateless.propTypes = {
//   ...SkyLightStateless.sharedPropTypes,
//   isVisible: React.PropTypes.bool,
// };

SkyLightStateless.defaultProps = {
  title: '',
  showOverlay: true,
  overlayStyles: styles.overlayStyles,
  dialogStyles: styles.dialogStyles,
  closeButtonStyle: styles.closeButtonStyle,
};
