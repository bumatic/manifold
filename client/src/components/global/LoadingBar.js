import React, { Component } from "react";
import PropTypes from "prop-types";

export default class LoadingBar extends Component {
  static propTypes = {
    loading: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = { status: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (this.loader) {
      if (nextProps.loading === true) {
        if (this.props.loading === false) {
          this.loader.className = "loading-bar loading";
        }
      } else if (this.props.loading === true) {
        this.loader.className = "loading-bar complete";
        this.timer = setTimeout(() => {
          this.loader.className = "loading-bar default";
        }, 800);
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    return (
      <div>
        <div
          ref={loader => {
            this.loader = loader;
          }}
          className="loading-bar default"
        >
          <div className="progress" />
        </div>
      </div>
    );
  }
}
