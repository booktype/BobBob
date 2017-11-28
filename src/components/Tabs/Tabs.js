import React, {PureComponent} from 'react';


export default class Tabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }

  selectTab = (tab) => {
    this.setState({
      selectedTab: tab
    });
  }

  render() {
    const commonTabClasses = "black pointer dim ttu dib link pa1 tc";

    return (
      <div className="bg-white mt3 mh3 bb b--moon-gray shadow-1">
        <div className="bg-near-white f6 flex shadow-1" style={{justifyContent: 'space-around'}}>
          {this.props.children.map((tab, idx) => {
            if (tab) {
              return (
                <a
                  key={idx}
                  className={
                    this.state.selectedTab === idx ? "w4 b bb bw2 " + commonTabClasses : "" + commonTabClasses
                  }
                  onClick={() => this.selectTab(idx)}
                >
                  {tab.props.label}
                </a>
              );
            } else {
              return null;
            }
          })}
        </div>
        {this.props.children[this.state.selectedTab]}
      </div>
    );
  }

}
