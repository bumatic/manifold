import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Notes } from "components/reader";

export default class Group extends PureComponent {
  static displayName = "Notes.Group";

  static propTypes = {
    annotations: PropTypes.array,
    header: PropTypes.string,
    handleVisitAnnotation: PropTypes.func,
    handleUpdateAnnotation: PropTypes.func,
    handleDeleteAnnotation: PropTypes.func
  };

  render() {
    if (!this.props.annotations) return null;
    return (
      <li className="selection-list separated">
        <div className="selection-group-heading">
          <h2>{this.props.header}</h2>
        </div>
        <ul>
          {this.props.annotations.map(annotation => {
            return (
              <Notes.Full.GroupItem
                key={annotation.id}
                annotation={annotation}
                handleVisitAnnotation={this.props.handleVisitAnnotation}
                handleUpdateAnnotation={this.props.handleUpdateAnnotation}
                handleDeleteAnnotation={this.props.handleDeleteAnnotation}
              />
            );
          })}
        </ul>
      </li>
    );
  }
}
