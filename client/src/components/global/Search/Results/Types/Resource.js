import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Link } from "react-router-dom";

import lh from "helpers/linkHandler";
import { FormattedDate } from "components/global";
import { Resourceish } from "components/frontend";

export default class SearchResultsTypeResource extends PureComponent {
  static displayName = "Search.Results.Type.Resource";

  static propTypes = {
    result: PropTypes.object,
  };

  render() {
    const { result } = this.props;
    const resource = get(result, 'relationships.resource');
    console.log(result, 'result');

    if (!resource) return false;
    const attr = resource.attributes;
    const project = get(resource, 'relationships.project');

    const resourceLink = project ? lh.link(
      "frontendProjectResource",
      project.attributes.slug,
      attr.slug
    ) : '#'

    return (
      <li className="result-resource" key={result.id}>
        <Link
          className="result"
          to={resourceLink}
        >
          <figure
            className="image"
          >
            <Resourceish.Thumbnail
              resourceish={resource}
              showTitle={false}
              showKind={false}
              additionalClasses="icon-only"
            ></Resourceish.Thumbnail>
          </figure>
          <div className="body">
            <h3 className="title"
              dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
            >
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
