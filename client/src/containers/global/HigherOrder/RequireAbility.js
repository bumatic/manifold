import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withCurrentUser from "containers/global/HigherOrder/withCurrentUser";
import isString from "lodash/isString";
import isPlainObject from "lodash/isPlainObject";
import { notificationActions } from "actions";

export class RequireAbilityComponent extends PureComponent {
  static propTypes = {
    entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
      .isRequired,
    requiredAbility: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
      .isRequired,
    behavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
    redirect: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentUser: PropTypes.object
  };

  static defaultProps = {
    behavior: "show",
    error: false
  };

  componentDidMount() {
    this.maybeError(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.maybeError(nextProps);
  }

  hasAbility(props) {
    const abilities = this.abilities(props);
    const { requiredAbility } = props;
    if (!abilities) return false;
    if (isString(requiredAbility)) {
      if (!abilities[requiredAbility]) return false;
      return abilities[requiredAbility];
    }
    const match = requiredAbility.find(ability => {
      return abilities[ability] === true;
    });
    return match !== undefined;
  }

  abilities(props) {
    if (isString(props.entity)) {
      if (!props.currentUser) return false;
      return props.currentUser.attributes.classAbilities[props.entity];
    }
    return props.entity.attributes.abilitiesForUser;
  }

  behavior(props) {
    return props.behavior;
  }

  maybeError(props) {
    if (this.error(props) && !this.hasAbility(props)) {
      let error = {
        title: "Access Denied.",
        detail: "You do not have sufficient permissions to perform this action."
      };
      if (isPlainObject(props.error)) {
        error = Object.assign(error, props.error);
      }
      props.dispatch(notificationActions.fatalError(error));
    }
  }

  error(props) {
    return !!props.error;
  }

  renderHide(props) {
    if (this.hasAbility(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  renderShow(props) {
    if (!this.hasAbility(props)) return null;
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  render() {
    if (!this.props.children) return false;
    const behavior = this.behavior(this.props);
    if (behavior === "hide") return this.renderHide(this.props);
    if (behavior === "show") return this.renderShow(this.props);
    return null;
  }
}

export default withCurrentUser(RequireAbilityComponent);
