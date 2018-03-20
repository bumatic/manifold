import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";

export class UsersWrapperContainer extends PureComponent {
  static displayName = "Users.Wrapper";

  static mapStateToProps = (stateIgnored, ownPropsIgnored) => {
    return {};
  };

  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      { path: lh.link("backendPeople"), label: "Users", key: "users" },
      { path: lh.link("backendPeopleMakers"), label: "Makers", key: "makers" }
    ];
  }

  render() {
    return (
      <HigherOrder.Authorize
        entity="user"
        failureFatalError={{
          detail: "You are not allowed to manage users and makers."
        }}
        ability="create"
      >
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </aside>
            <div className="panel">{childRoutes(this.props.route)}</div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(UsersWrapperContainer.mapStateToProps)(
  UsersWrapperContainer
);
