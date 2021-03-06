import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as GlobalForm } from "components/global";
import isString from "lodash/isString";
import classnames from "classnames";
import Instructions from "./Instructions";

class FormTextArea extends Component {
  static displayName = "Form.TextArea";

  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    height: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.string,
    errors: PropTypes.array,
    name: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static defaultProps = {
    height: 100
  };

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });

    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={this.props.name}
          errors={this.props.errors}
          label={this.props.label}
        >
          <label className={labelClass}>{this.props.label}</label>
          <Instructions instructions={this.props.instructions} />
          <textarea
            style={{ height: this.props.height }}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            value={this.props.value || ""}
          />
        </GlobalForm.Errorable>
      </div>
    );
  }
}

export default setter(FormTextArea);
