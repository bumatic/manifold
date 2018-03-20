import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Link } from "react-router-dom";

import lh from "helpers/linkHandler";
import { FormattedDate } from "components/global";
import { Text } from "components/frontend";

export default class SearchResultsTypeText extends PureComponent {
  static displayName = "Search.Results.Type.Text";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
  };

  render() {
    const { result } = this.props;
    const text = get(result, 'relationships.text');

    if (!text) return false;
    const attr = text.attributes;
    const project = get(text, 'relationships.project');

    console.log(project, 'atty');

    return (
      <li className="result-text" key={result.id}>
        <Link
          className="result"
          to={lh.link("reader", attr.slug)}
        >
          <figure className="image">
            <Text.Cover
              text={text}
            ></Text.Cover>
          </figure>
          <div className="body">
            <h3 className="title">
              {attr.title}
            </h3>
            { project ?
              <p className="subtitle">
                Project: {project.attributes.title}
              </p> : null
            }
            <div className="date">
              <FormattedDate
                prefix="Published"
                format="MMMM, YYYY"
                date={attr.createdAt}
              ></FormattedDate>
            </div>
          </div>
          <div className="marker tertiary">
            {this.props.typeLabel}
          </div>
        </Link>
      </li>
    );
  }
}
