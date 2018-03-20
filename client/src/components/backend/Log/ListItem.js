import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import humps from "humps";

export default class LogListItem extends PureComponent {
  static displayName = "Log.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  render() {
    const version = this.props.entity;
    if (!version) return null;
    if (isEmpty(version.attributes.objectChanges)) return null;

    return (
      <li key={version.id} className="primary">
        <div className="results-body">
          <h4 className="results-header">
            <Link
              to={lh.link("backendResource", version.attributes.itemId)}
              dangerouslySetInnerHTML={{
                __html: version.attributes.itemDisplayName
              }}
            />
            <div className="subtitle">
              {Object.keys(version.attributes.objectChanges)
                .map(change => humps.decamelize(change, { separator: " " }))
                .join(", ")}
            </div>
          </h4>
          <div className="results-desc flush">
            <FormattedDate date={version.attributes.createdAt} />
            {` by `}
            <Link to={lh.link("backendPeopleUser", version.attributes.actorId)}>
              {`${version.attributes.actorName}`}
            </Link>
          </div>
        </div>
      </li>
    );
  }
}
