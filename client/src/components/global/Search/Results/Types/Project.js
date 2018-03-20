import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class SearchResultsTypeProject extends PureComponent {
  static displayName = "Search.Results.Type.Project";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
  };

  render() {
    const { result } = this.props;

    const image = "https://manifold.umn.edu" +
      "/system/projects/avatars/d/9/c/" +
      "small-cf08d1ffff8ed5d3a037cb0438d47fc3d6593c1e.jpg";
    return (
      <li className="result-project" key={result.id}>
        <a className="result" href="#">
          <figure className="image">
            <img src={image}/>
          </figure>
          <div className="body">
            <h3 className="title">
              {'Project title'}
            </h3>
            <p className="subtitle">
              {'Optional project subtitle'}
            </p>
            <ul className="makers">
              <li>
                {'Maker Beta'}
              </li>
              <li>
                {'Maker Epsilon'}
              </li>
              <li>
                {'Maker Sigma'}
              </li>
            </ul>
            <div className="date">
              {'Published September, 2017'}
            </div>
          </div>
          <div className="marker tertiary">
            {this.props.typeLabel}
          </div>
        </a>
      </li>
    );
  }
}
