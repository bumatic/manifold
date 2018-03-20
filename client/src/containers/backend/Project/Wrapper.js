import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Dialog, Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import endsWith from "lodash/endsWith";

const { request, flush } = entityStoreActions;

export class ProjectWrapperContainer extends PureComponent {
  static displayName = "Project.Wrapper";

  static mapStateToProps = state => {
    return {
      project: select(requests.feProject, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
    this.fetchProject = this.fetchProject.bind(this);
    this.doPreview = this.doPreview.bind(this);
    this.doDestroy = this.doDestroy.bind(this);
    this.handleProjectDestroy = this.handleProjectDestroy.bind(this);
  }

  componentWillMount() {
    this.fetchProject();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
  }

  fetchProject() {
    const call = projectsAPI.show(this.props.match.params.id);
    const projectRequest = request(call, requests.feProject);
    this.props.dispatch(projectRequest);
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  secondaryNavigationLinks(project) {
    return [
      {
        path: lh.link("backendProject", project.id),
        label: "General",
        key: "general",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectProjectPage", project.id),
        label: "Appearance",
        key: "projectPage",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectPermissions", project.id),
        label: "Permissions",
        key: "permissions",
        entity: "permission",
        ability: "create"
      },
      {
        path: lh.link("backendProjectCollaborators", project.id),
        label: "People",
        key: "collaborators",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectTexts", project.id),
        label: "Texts",
        key: "texts",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectResources", project.id),
        label: "Resources",
        key: "resources",
        entity: project,
        ability: "updateMetadata"
      },
      {
        path: lh.link("backendProjectCollections", project.id),
        label: "Collections",
        key: "collections",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectEvents", project.id),
        label: "Activity",
        key: "events",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectMetadata", project.id),
        label: "Metadata",
        key: "metadata",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectSocial", project.id),
        label: "Social",
        key: "social",
        entity: project,
        ability: "update"
      },
      {
        path: lh.link("backendProjectLog", project.id),
        label: "Log",
        key: "log",
        entity: "version",
        ability: "read"
      }
    ];
  }

  doPreview(event) {
    event.preventDefault();
    const win = window.open(
      lh.link("frontendProject", this.props.project.attributes.slug),
      "_blank"
    );
    win.focus();
  }

  doDestroy() {
    const call = projectsAPI.destroy(this.props.project.id);
    const options = { removes: this.props.project };
    const projectRequest = request(call, requests.beProjectDestroy, options);
    this.props.dispatch(projectRequest).promise.then(() => {
      this.redirectToDashboard();
    });
  }

  redirectToDashboard() {
    this.props.history.push(lh.link("backend"));
  }

  handleProjectDestroy(event) {
    const heading = "Are you sure you want to delete this project?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy(event);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  }

  maybeRedirectToResources(project) {
    if (endsWith(this.props.location.pathname, "resources")) return null;
    if (project.attributes.abilitiesForUser.update) return null;
    if (project.attributes.abilitiesForUser.updateMetadata)
      return this.props.history.push(
        lh.link("backendProjectResources", project.id)
      );
  }

  renderUtility(project) {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          Preview <i className="manicon manicon-eye-outline" />
        </button>
        <HigherOrder.RequireAbility entity={project} requiredAbility={"delete"}>
          <button
            onClick={this.handleProjectDestroy}
            className="button-bare-primary"
          >
            Delete <i className="manicon manicon-trashcan" />
          </button>
        </HigherOrder.RequireAbility>
      </div>
    );
  }

  renderRoutes() {
    const { project } = this.props;
    const refresh = this.fetchProject;
    return childRoutes(this.props.route, { childProps: { refresh, project } });
  }

  render() {
    if (!this.props.project) return null;
    const { project } = this.props;
    this.maybeRedirectToResources(project);

    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <Navigation.DetailHeader
          type="project"
          breadcrumb={[{ path: lh.link("backend"), label: "ALL PROJECTS" }]}
          title={project.attributes.title}
          subtitle={project.attributes.subtitle}
          utility={this.renderUtility(project)}
        />
        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
              />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary
                links={this.secondaryNavigationLinks(project)}
              />
            </aside>
            <div className="panel">{this.renderRoutes()}</div>
          </div>
        </section>
      </div>
    );
  }
}

export default connectAndFetch(ProjectWrapperContainer);
