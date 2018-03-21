import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Link } from "react-router-dom";

import lh from "helpers/linkHandler";
import { FormattedDate } from "components/global";
import { Project } from "components/frontend";

export default class SearchResultsTypeProject extends PureComponent {
  static displayName = "Search.Results.Type.Project";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
  };

  render() {
    const { result } = this.props;
    const project = get(result, 'relationships.project');

    // Only render if project exists
    if (!project) return false;
    const attr = project.attributes;

    return (
      <li className="result-project" key={result.id}>
        <Link
          className="result"
          to={lh.link("frontendProject", attr.slug)}
        >
          <figure className="image">
            <Project.Cover project={project} />
          </figure>
          <div className="body">
            <h3 className="title">
              {attr.title}
            </h3>
            {attr.subtitle ?
              <p className="subtitle">
                {project.attributes.subtitle}
              </p> : null
            }
            {project.relationships.creators ?
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
              </ul> : null
            }
            <div className="date">
              <FormattedDate
                prefix="Published"
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
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
