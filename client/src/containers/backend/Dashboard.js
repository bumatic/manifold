import React, { PureComponent } from "react";
import { HigherOrder } from "containers/global";
import { Dashboards } from "containers/backend";
import lh from "helpers/linkHandler";

export default class DashboardContainer extends PureComponent {
  render() {
    return (
      <HigherOrder.Authorize
        kind={[
          "admin",
          "editor",
          "marketeer",
          "project_creator",
          "project_editor",
          "project_resource_editor",
          "project_author"
        ]}
        failureRedirect={lh.link("frontend")}
        failureNotification
      >
        <HigherOrder.Authorize kind="project_author">
          <Dashboards.Author />
        </HigherOrder.Authorize>
        <HigherOrder.Authorize kind="project_author" successBehavior="hide">
          <Dashboards.Admin />
        </HigherOrder.Authorize>
      </HigherOrder.Authorize>
    );
  }
}
