import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withCurrentUser from "containers/global/HigherOrder/withCurrentUser";
import { Dashboards } from "containers/backend";

export class DashboardContainer extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object
  };

  render() {
    const currentUser = this.props.currentUser;
    if (!currentUser) return null;
    if (currentUser.attributes.kind === "project_author")
      return <Dashboards.Author />;
    return <Dashboards.Admin />;
  }
}

export default withCurrentUser(DashboardContainer);
