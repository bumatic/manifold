import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'components/backend';
import Placeholder from './Placeholder';

class SettingsGeneralContainer extends PureComponent {

  static activeNavItem = "general";

  render() {
    return (
      <section>
        <Placeholder label="general" />
      </section>
    );
  }

}

export default connect(
  SettingsGeneralContainer.mapStateToProps
)(SettingsGeneralContainer);
