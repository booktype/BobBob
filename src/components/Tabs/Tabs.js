import React, {PureComponent} from 'react';


export default class Tabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.children[this.state.selectedTab]) {
      this.selectTab(0);
    }
  }
  selectTab = (tab) => {
    this.setState({
      selectedTab: tab
    });
  }

  render() {
    return (
      <div className="bg-white mt3 mh3 bb shadow-1 br2 ">
        <div className="bg-blue f6 flex shadow-1" style={{justifyContent: 'space-around'}}>
          {this.props.children.map((tab, idx) => {
            if (tab) {
              return (
                <a
                  key={idx}
                  className={
                    this.state.selectedTab === idx ? "ttu dib link pa1 white w3 b bb bw2" : "ttu dib link pa1 white"
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
