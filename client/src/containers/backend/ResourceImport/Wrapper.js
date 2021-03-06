import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Navigation } from "components/backend";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { resourceImportsAPI, requests } from "api";
import { grab, isEntityLoaded } from "utils/entityUtils";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export class ResourceImportWrapper extends PureComponent {
  static displayName = "ResourceImport.Wrapper";
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    project: PropTypes.object,
    resourceImport: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  static fetchData = (getState, dispatch, location, match) => {
    if (isEntityLoaded("resourceImports", match.params.id, getState())) return;
    if (!match.params.projectId || !match.params.id) return;
    const call = resourceImportsAPI.show(
      match.params.projectId,
      match.params.id
    );
    const resourceImport = request(call, requests.beResourceImportFetch);
    return dispatch(resourceImport);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      resourceImport: grab(
        "resourceImports",
        ownProps.match.params.id,
        state.entityStore
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      fileLoaded: false
    };
  }

  fetch = () => {
    const { match, dispatch } = this.props;
    const call = resourceImportsAPI.show(
      match.params.projectId,
      match.params.id
    );
    const resourceImport = request(call, requests.beResourceImportFetch);
    return dispatch(resourceImport);
  };

  create = model => {
    const { match } = this.props;
    return resourceImportsAPI.create(match.params.projectId, model);
  };

  executeUpdate = attributes => {
    const { dispatch } = this.props;
    const call = this.update(null, attributes);
    const resourceImport = request(call, requests.beResourceImportFetch);
    return dispatch(resourceImport);
  };

  update = (idIgnored, model) => {
    const { match } = this.props;
    return resourceImportsAPI.update(
      match.params.projectId,
      match.params.id,
      model
    );
  };

  renderRoutes() {
    const { match, project, resourceImport } = this.props;
    if (match.params.id && !resourceImport) return null;
    const childProps = {
      project,
      resourceImport,
      fetch: this.fetch,
      create: this.create,
      update: this.update,
      executeUpdate: this.executeUpdate
    };
    return childRoutes(this.props.route, { childProps });
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <Navigation.DetailHeader
          type="resources"
          breadcrumb={[
            {
              path: lh.link("backendProjectResources", match.params.projectId),
              label: "Resources"
            }
          ]}
          title={"Bulk Add Resources"}
          showUtility={false}
          note={`Import resources from CSV or Google Sheet, with file assets stored in a
          google drive folder.`}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="">{this.renderRoutes()}</div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(ResourceImportWrapper);
