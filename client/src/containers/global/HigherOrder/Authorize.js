import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { Redirect } from "react-router-dom";
import { notificationActions } from "actions";

export class AuthorizeComponent extends PureComponent {
  static mapStateToProps = state => {
    return {
      authentication: state.authentication
    };
  };

  static propTypes = {
    entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    ability: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    kind: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    successBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    failureRedirect: PropTypes.string,
    failureNotification: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]),
    failureFatalError: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    authentication: PropTypes.object
  };

  static defaultProps = {
    successBehavior: "show",
    failureRedirect: null,
    failureNotification: null,
    failureFatalError: null
  };

  constructor() {
    super();
    this.state = { redirect: false };
  }

  componentDidMount() {
    this.maybeError(this.props);
    this.maybeNotify(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.maybeRedirect(nextProps)) this.setState({ redirect: true });
  }

  maybeRedirect(props) {
    if (!isString(props.failureRedirect)) return false;
    if (props.failureFatalError) return false;
    return !this.authorize(props);
  }

  isAuthenticated(props) {
    return props.authentication.authenticated;
  }

  currentUser(props) {
    return props.authentication.currentUser;
  }

  successBehavior(props) {
    return props.successBehavior;
  }

  hasAbility(props) {
    const abilities = this.abilities(props);
    if (!abilities) return false;
    const { ability } = props;
    if (isString(ability)) {
      if (!abilities[ability]) return false;
      return abilities[ability];
    }
    const match = ability.find(a => {
      return abilities[a] === true;
    });
    return match !== undefined;
  }

  hasKind(props) {
    if (props.kind === "none") return true;
    if (props.kind === "unauthenticated" && !this.isAuthenticated(props))
      return true;
    if (!this.isAuthenticated(props)) return false;
    if (props.kind === "any" && this.isAuthenticated(props)) return true;
    const currentUser = this.currentUser(props);
    if (Array.isArray(props.kind))
      return props.kind.includes(currentUser.attributes.kind);
    return props.kind === currentUser.attributes.kind;
  }

  abilities(props) {
    if (!props.entity) return false;
    if (isString(props.entity)) {
      const currentUser = this.currentUser(props);
      if (!currentUser) return false;
      return currentUser.attributes.classAbilities[props.entity];
    }
    return props.entity.attributes.abilitiesForUser;
  }

  maybeError(props) {
    if (!!props.failureFatalError && !this.authorize(props)) {
      let error = {
        title: "Access Denied.",
        detail: "You do not have sufficient permissions to perform this action."
      };
      if (isPlainObject(props.failureFatalError)) {
        error = Object.assign(error, props.failureFatalError);
      }
      props.dispatch(notificationActions.fatalError(error));
    }
  }

  maybeNotify(props) {
    if (!!props.failureNotification && !this.authorize(props)) {
      let error = {
        heading: "Access Denied.",
        body: "You do not have sufficient permissions to perform this action.",
        level: 2
      };
      if (isPlainObject(props.failureNotification)) {
        error = Object.assign(error, props.failureNotification);
      }
      props.dispatch(notificationActions.addNotification(error));
    }
  }

  authorize(props) {
    if (props.kind && !props.ability) {
      return this.hasKind(props);
    }
    if (props.ability) {
      return this.hasAbility(props);
    }
    return this.hasKind(props) && this.hasAbility(props);
  }

  renderHide(props) {
    if (this.authorize(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  renderShow(props) {
    if (!this.authorize(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  render() {
    if (this.state.redirect)
      return <Redirect to={this.props.failureRedirect} />;
    if (!this.props.children) return false;
    const successBehavior = this.successBehavior(this.props);
    if (successBehavior === "hide") return this.renderHide(this.props);
    if (successBehavior === "show") return this.renderShow(this.props);
    return null;
  }
}

export default connect(AuthorizeComponent.mapStateToProps)(AuthorizeComponent);
