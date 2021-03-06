import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { settingsAPI, requests } from "api";
import { select } from "utils/entityUtils";

export class SettingsGeneralContainer extends PureComponent {
  static propTypes = {
    settings: PropTypes.object
  };

  static mapStateToProps = state => {
    return {
      settings: select(requests.settings, state.entityStore)
    };
  };

  render() {
    if (!this.props.settings) return null;
    return (
      <section>
        <FormContainer.Form
          model={this.props.settings}
          name="backend-settings"
          update={settingsAPI.update}
          create={settingsAPI.update}
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="How do you refer to your Manifold installation?"
            name="attributes[general][installationName]"
            placeholder="Manifold"
            instructions={
              'There are various places throughout the application where \
            Manifold refers to itself. If you set a value here, Manifold will use it where \
            appropriate. For example, you could call it "Manifold at the University of \
            Minnesota Press" or just "University of Minnesota Digital Books." Or, if you\
            prefer, you can leave this blank, and Manifold will just refer to itself as \
            "Manifold."'
            }
          />
          <Form.TextInput
            label="Default Publisher"
            name="attributes[general][defaultPublisher]"
            placeholder="Enter Default Publisher"
          />
          <Form.TextInput
            label="Default Place of Publication"
            name="attributes[general][defaultPlaceOfPublication]"
            placeholder="Enter Default Place of Publication"
          />
          <Form.TextInput
            label="Copyright"
            name="attributes[general][copyright]"
            placeholder="Enter Copyright Information"
            instructions="Enter the installation copyright information to be displayed in the footer."
          />
          <Form.TextInput
            label="Social Sharing Message"
            name="attributes[general][socialShareMessage]"
            instructions="Enter the text you would like to appear when a page is shared"
          />
          <Form.TextInput
            label="Contact Link URL"
            name="attributes[general][contactUrl]"
            placeholder="Enter a URL"
          />
          <Form.Save text="Save Settings" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(SettingsGeneralContainer.mapStateToProps)(
  SettingsGeneralContainer
);
