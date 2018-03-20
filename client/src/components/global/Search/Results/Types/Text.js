import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text } from "components/global";

export default class SearchResultsTypeText extends PureComponent {
  static displayName = "Search.Results.Type.Text";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
  };

  render() {
    const { result } = this.props;
    return (
      <li className="result-text" key={result.id}>
        <a href="#" className="result">
          <figure className="image">
            <Text.Placeholder>
            </Text.Placeholder>
          </figure>
          <div className="body">
            <h3 className="title">
              {'Text Title'}
            </h3>
            <p className="subtitle">
              {'Project: Project Title'}
            </p>
          </div>
          <div className="marker tertiary">
            {this.props.typeLabel}
          </div>
        </a>
      </li>
    );
  }
}
