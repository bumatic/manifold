import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form as GlobalForm } from "components/global";
import setter from "./setter";
import isNull from "lodash/isNull";
import Instructions from "./Instructions";

class FormSelect extends Component {
  static displayName = "Form.Select";

  static propTypes = {
    value: PropTypes.any,
    errors: PropTypes.array,
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired
  };

  render() {
    const value = isNull(this.props.value) ? "" : this.props.value;

    const options = this.props.options.map(option => {
      return (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
    });

    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
        >
          <label>{this.props.label}</label>
          <Instructions instructions={this.props.instructions} />
          <div className="form-select">
            <i className="manicon manicon-caret-down" />
            <select onChange={this.props.onChange} value={value}>
              {options}
            </select>
          </div>
        </GlobalForm.Errorable>
      </div>
    );
  }
}

export default setter(FormSelect);
