import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { resourcesAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { Overlay } from "components/global";
import { Notation } from "components/reader";

const { request, flush } = entityStoreActions;

export class NotationResourceDetailContainer extends PureComponent {
  static displayName = "ReaderContainer.Notation.Resource.Detail";

  static fetchData = (getState, dispatch, location, match) => {
    const promises = [];
    const resourceCall = resourcesAPI.show(match.params.resourceId);
    const { promise: one } = dispatch(
      request(resourceCall, requests.rResource)
    );
    promises.push(one);
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    const newState = {
      resource: select(requests.rResource, state.entityStore),
      resourceMeta: meta(requests.rResource, state.entityStore)
    };
    return Object.assign({}, newState, ownProps);
  };

  static propTypes = {
    route: PropTypes.object,
    match: PropTypes.object,
    resource: PropTypes.object,
    dispatch: PropTypes.func,
    history: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.rResource));
  }

  render() {
    if (!this.props.resource) return null;
    return (
      <Overlay
        closeCallback={this.props.history.goBack}
        appearance="overlay-full bg-neutral90"
      >
        <div className="notation-detail">
          <Notation.Resource.Detail
            resource={this.props.resource}
            handleClose={this.props.history.goBack}
          />
        </div>
      </Overlay>
    );
  }
}

export default connectAndFetch(NotationResourceDetailContainer);
