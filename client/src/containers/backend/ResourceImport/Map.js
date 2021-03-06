import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form as FormContainer } from "containers/backend";
import { Form } from "components/backend";
import connectAndFetch from "utils/connectAndFetch";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export class ResourceImportMap extends PureComponent {
  static displayName = "ResourceImport.Map";

  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    resourceImport: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { resourceImport } = this.props;
    if (resourceImport.attributes.state === "pending") {
      const { projectId } = this.props.match.params;
      const url = lh.link(
        "backendResourceImportEdit",
        projectId,
        resourceImport.id
      );
      this.props.history.push(url);
    }
  }

  onSuccess = model => {
    const { projectId } = this.props.match.params;
    const importId = model.id;
    const url = lh.link("backendResourceImportResults", projectId, importId);
    this.props.history.push(url);
  };

  backLinkUrl() {
    const { match } = this.props;
    return lh.link(
      "backendResourceImportEdit",
      match.params.projectId,
      match.params.id
    );
  }

  create = model => {
    return this.props.create(this.preSave(model));
  };

  update = (id, model) => {
    return this.props.update(id, this.preSave(model));
  };

  /* eslint-disable no-param-reassign */
  preSave = model => {
    model.attributes.state = "mapped";
    return model;
  };
  /* eslint-enable no-param-reassign */

  render() {
    const { resourceImport } = this.props;

    return (
      <div>
        <FormContainer.Form
          model={resourceImport}
          name="backend-resource-import-update"
          create={this.create}
          update={this.update}
          onSuccess={this.onSuccess}
          className="form-secondary"
        >
          <Form.FieldGroup label="Step 3: Map Columns to Resource Attributes">
            <Form.AttributeMap
              instructions={
                "The column on the left side lists the column headers " +
                "found in your spreadsheet. The column on the right lists the attributes " +
                "that can be set on Manifold resources. Drag the attributes on the right " +
                'to the corresponding columns on the left. Pressing the "automatically ' +
                'map attributes" button will attempt to automatically match the ' +
                "attributes with the spreadsheet columns."
              }
              name="attributes[columnMap]"
              attributes="attributes[availableColumns]"
              headers="attributes[headers]"
            />
          </Form.FieldGroup>
          <div
            className="buttons-icon-horizontal"
            style={{
              marginTop: "30px"
            }}
          >
            <Link
              to={this.backLinkUrl()}
              className="button-icon-secondary dull"
            >
              <i className="manicon manicon-x small" />Back
            </Link>
            <button type="submit" className="button-icon-secondary">
              <i className="manicon manicon-check small" />Continue
            </button>
          </div>
        </FormContainer.Form>
      </div>
    );
  }
}

export default connectAndFetch(ResourceImportMap);
