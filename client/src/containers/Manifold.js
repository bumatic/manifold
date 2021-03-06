import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Helmet from "react-helmet";
import { SignInUp, LoadingBar } from "components/global";
import config from "../config";
import has from "lodash/has";
import get from "lodash/get";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import {
  uiVisibilityActions,
  routingActions,
  currentUserActions
} from "actions";
import { meAPI, settingsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { closest } from "utils/domUtils";
import ReactGA from "react-ga";
import Typekit from "react-typekit";
import { renderRoutes } from "react-router-config";
import getRoutes from "/routes";
import ch from "../helpers/consoleHelpers";

const routes = getRoutes();
const { request } = entityStoreActions;
const { visibilityHide } = uiVisibilityActions;

class ManifoldContainer extends PureComponent {
  // This method will bootstrap data into manifold. Nothing else is loaded into the
  // store at this point, including params and the authenticated user.
  static bootstrap = (getState, dispatch, cookie) => {
    const promises = [];
    const state = getState();

    // Load settings if they have not already been loaded.
    const loaded = has(state, "entityStore.entities.settings.0");
    if (!loaded) {
      const settingsRequest = request(settingsAPI.show(), requests.settings, {
        oneTime: true
      });
      const settingsPromise = dispatch(settingsRequest).promise;
      settingsPromise.then(
        () => {
          ch.info("Settings loaded", "sparkles");
        },
        () => {
          ch.error("Settings failed to load", "rain_cloud");
        }
      );
      promises.push(settingsPromise);
    }

    // Authenticate from cookie.
    if (cookie && !state.authentication.authenticated) {
      const authToken = cookie.authToken;
      if (authToken) {
        const authPromise = dispatch(currentUserActions.login({ authToken }));
        authPromise.then(
          () => {
            ch.info("User authenticated", "sparkles");
          },
          () => {
            ch.info("Unable to authenticate user", "rain_cloud");
          }
        );
        promises.push(authPromise);
      }
    }

    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      loading: state.ui.transitory.loading.active,
      notifications: state.notifications,
      routing: state.routing,
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool,
    visibility: PropTypes.object,
    authentication: PropTypes.object,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
    settings: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
    confirm: PropTypes.element,
    gaInitCallback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.gaInitialized = false;
    this.handleGlobalClick = this.handleGlobalClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.userJustLoggedOut(
        this.props.authentication,
        nextProps.authentication
      )
    ) {
      this.doPostLogout();
    }
    if (this.receivedGaTrackingId(nextProps.settings) && !this.gaInitialized) {
      ReactGA.initialize(nextProps.settings.attributes.general.gaTrackingId);
      this.gaInitialized = true;
      if (nextProps.gaInitCallback) nextProps.gaInitCallback();
    }
    if (this.routeChanged(this.props.location, nextProps.location)) {
      this.props.dispatch(routingActions.update(nextProps.location.state));
    }
  }

  routeChanged(location, nextLocation) {
    return location.pathname !== nextLocation.pathname;
  }

  receivedGaTrackingId(nextSettings) {
    const path = "attributes.general.gaTrackingId";
    return has(nextSettings, path) && get(nextSettings, path) !== "";
  }

  userJustLoggedOut(auth, nextAuth) {
    return nextAuth.authenticated === false && auth.authenticated === true;
  }

  doPostLogout() {
    this.redirectToHome();
  }

  redirectToHome() {
    this.props.history.push("/");
  }

  updateCurrentUser() {
    this.props.dispatch(
      request(meAPI.show(), requests.gAuthenticatedUserUpdate)
    );
  }

  handleGlobalClick(event) {
    if (!closest(event.target, ".panel-visible"))
      return this.props.dispatch(uiVisibilityActions.panelHideAll());
    if (event.target.classList.contains("drawer-overlay"))
      return this.props.dispatch(uiVisibilityActions.panelHideAll());
    return null;
  }

  renderTypekit() {
    const tkId = get(this.props.settings, "attributes.theme.typekitId");
    const tkEnabled = !!tkId;
    if (!tkEnabled) return null;
    return <Typekit kitId={tkId} />;
  }

  render() {
    const hideSignInUpOverlay = bindActionCreators(
      () => visibilityHide("signInUpOverlay"),
      this.props.dispatch
    );

    return (
      <div onClick={this.handleGlobalClick} className="global-container">
        <div id="global-notification-container" />
        <div id="global-overlay-container" />
        {this.renderTypekit()}
        {this.props.confirm}
        <Helmet {...config.app.head} />
        <LoadingBar loading={this.props.loading} />
        <ReactCSSTransitionGroup
          transitionName={"overlay-login"}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.props.visibility.signInUpOverlay ? (
            <SignInUp.Overlay
              key="signInUpOverlay"
              hideSignInUpOverlay={hideSignInUpOverlay}
              authentication={this.props.authentication}
              dispatch={this.props.dispatch}
              hash={get(this, "props.routing.locationBeforeTransitions.hash")}
            />
          ) : null}
        </ReactCSSTransitionGroup>
        {renderRoutes(routes)}
      </div>
    );
  }
}

const Manifold = withRouter(
  connect(ManifoldContainer.mapStateToProps)(ManifoldContainer)
);

export default Manifold;
