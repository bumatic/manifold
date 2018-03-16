import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withCurrentUser from "containers/global/HigherOrder/withCurrentUser";
import isString from "lodash/isString";

export class RequireAbilityComponent extends PureComponent {
  static propTypes = {
    entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
      .isRequired,
    requiredAbility: PropTypes.string.isRequired,
    hasAbilityBehavior: PropTypes.oneOf(["hide", "show"]).isRequired,
    redirect: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    currentUser: PropTypes.object
  };

  static defaultProps = {
    hasAbilityBehavior: "show"
  };

  hasAbility(props) {
    const abilities = this.abilities(props);
    const ability = props.requiredAbility;
    if (!abilities) return false;
    if (!abilities[ability]) return false;
    return abilities[ability];
  }

  abilities(props) {
    if (isString(props.entity)) {
      if (!props.currentUser) return false;
      return props.currentUser.attributes.classAbilities[props.entity];
    }
    return props.entity.attributes.abilities;
  }

  behavior(props) {
    return props.hasAbilityBehavior;
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
