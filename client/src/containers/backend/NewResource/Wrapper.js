import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form as FormContainer } from 'containers/backend';
import { Resource, Navigation, Form } from 'components/backend';
import { resourcesAPI, notifications } from 'api';
import { notificationActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { browserHistory } from 'react-router';

const { flush } = entityStoreActions;

class NewResourceWrapperContainer extends PureComponent {

  static displayName = "NewResource.WrapperContainer";
  static activeNavItem = "resources";

  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      resourceKind: 'image'
    };

    this.handleSuccess = this.handleSuccess.bind(this);
    this.setResourceKind = this.setResourceKind.bind(this);
  }

  redirectToResource(resource) {
    browserHistory.push(`/backend/resource/${resource.id}`);
  }

  setResourceKind(kind) {
    this.setState({
      resourceKind: kind
    });
  }

  handleSuccess(resource) {
    this.redirectToResource(resource);
  }

  render() {
    return (
      <div>
        <Navigation.DetailHeader
          type="resource"
          breadcrumb={[
            { path: `/backend/project/${this.props.params.projectId}/resources`, label: "Project" }
          ]}
          title={'New Resource'}
          showUtility={false}
          note={'Select your resource type, then enter a name and a brief description.' +
          ' Press save to continue.'}
        />
        <section className="backend-panel">
          <div className="container">
            <div className="panel">
              <Resource.Form.KindPicker
                kind={this.state.resourceKind}
                setKind={this.setResourceKind}
                includeButtons
              />
              <FormContainer.Form
                route={this.props.routes[this.props.routes.length - 1]}
                model={this.props.resource}
                name="backend-resource-create"
                update={resourcesAPI.update}
                create={ (model) => resourcesAPI.create(this.props.params.projectId, model) }
                onSuccess={this.handleSuccess}
                className="form-secondary"
              >
                <Form.TextInput
                  label="Title"
                  name="attributes[title]"
                  placeholder="Enter a resource title"
                />
                <Form.TextArea
                  label="Description"
                  name="attributes[description]"
                  placeholder="Enter a description"
                />
                <Resource.Form.KindAttributes kind={this.state.resourceKind} />
                <Form.Hidden
                  name="attributes[kind]"
                  value={this.state.resourceKind}
                />
                <Form.Save
                  text="Save and continue"
                  cancelRoute={`/backend/project/${this.props.params.projectId}/resources`}
                />
              </FormContainer.Form>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

export default connect(
  NewResourceWrapperContainer.mapStateToProps
)(NewResourceWrapperContainer);

