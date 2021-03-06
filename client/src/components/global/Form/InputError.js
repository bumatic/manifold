import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import capitalize from "lodash/capitalize";
import humps from "humps";

export default class InputError extends Component {
  static propTypes = {
    errors: PropTypes.array,
    name: PropTypes.string
  };

  constructor() {
    super();
    this.hasErrors = this.hasErrors.bind(this);
  }

  hasErrors() {
    return this.props.errors.length > 0;
  }

  nameFromPointer(pointer) {
    return humps.decamelize(pointer.split("/").pop(), { separator: " " });
  }

  errorString(error) {
    const param = get(error, "source.param");
    const pointer = get(error, "source.pointer");
    const name = this.props.name || param || this.nameFromPointer(pointer);
    return `${capitalize(name)} ${error.detail}.  `;
  }

  /* eslint-disable react/no-array-index-key */
  render() {
    if (this.hasErrors()) {
      return (
        <span className="errors">
          {this.props.errors.map((e, i) => {
            return (
              <span key={i} className="error">
                {this.errorString(e)}
                <br />
              </span>
            );
          })}
        </span>
      );
    }
    return null;
  }
  /* eslint-enable react/no-array-index-key */
}
