import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "containers/global";
import { NavLink } from "react-router-dom";

export default class NavigationSecondary extends Component {
  static displayName = "Navigation.Secondary";

  static propTypes = {
    links: PropTypes.array
  };

  renderItem(link) {
    return (
      <li key={link.key}>
        <NavLink exact to={link.path} activeClassName="active">
          {link.label}
        </NavLink>
      </li>
    );
  }

  render() {
    return (
      <nav className="panel-nav">
        <ul>
          {this.props.links.map(link => {
            if (link.ability)
              return (
                <HigherOrder.RequireAbility
                  key={`${link.key}-wrapped`}
                  entity={link.entity}
                  requiredAbility={link.ability}
                >
                  {this.renderItem(link)}
                </HigherOrder.RequireAbility>
              );
            return this.renderItem(link);
          })}
        </ul>
      </nav>
    );
  }
}
