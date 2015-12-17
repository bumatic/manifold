import React, { Component, PropTypes } from 'react';

export default class UserButton extends Component {

  static propTypes = {
    showLoginOverlay: PropTypes.func,
    authenticated: PropTypes.bool,
    userAvatar: PropTypes.string
  };

  // TODO: Get this dynamically from user data
  static defaultProps = {
    userAvatar: '/placeholder/user-avatar-dreft01.jpg'
  };

  UIToggleUserMenu = () => {
    console.log('This will open the user menu!');
  };

  UIShowLoginOverlay = () => {
    this.props.showLoginOverlay();
  };

  avatarImage = () => {
    let output = '';
    if (this.props.authenticated && this.props.userAvatar) {
      output = (
          <img className="avatar-image" src={this.props.userAvatar}/>
      );
    } else {
      output = (
          <i className="manicon manicon-person"></i>
      );
    }

    return output;
  };

  render = () => {
    return (
        <button className="button-avatar" onClick={this.props.authenticated ? this.UIToggleUserMenu.bind(this) : this.UIShowLoginOverlay.bind(this)}>
          <span className="screen-reader-text">{'Click to login or open user settings'}</span>
          <figure className="avatar">
            {this.avatarImage()}
          </figure>
        </button>
    );
  };
}

