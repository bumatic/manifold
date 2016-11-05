import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

export default class BackendWrapper extends Component {
  // static mapStateToProps(state) {
  //   return {
  //     project: select(requests.showProjectDetail, state.entityStore)
  //   };
  // }

  static propTypes = {};

  render() {
    return (
      <section className="bg-neutral95">
        <div className="container flush">
          <Link to={'/backend/dashboard'} className="back-link-primary">
             <i className="manicon manicon-arrow-left"></i>
             Back to: <span>ALL PROJECTS</span>
          </Link>
          <header className="project-header">
            <figure>
              <i className="manicon manicon-project-placeholder"></i>
            </figure>
            <div className="project-title">
              <h1>
                Japanese Documentary Film
                <span className="subtitle">
                  The Meiji Era through Hiroshima
                </span>
              </h1>
              <div className="project-utility">
                <button className="button-bare-primary">Preview <i className="manicon manicon-eye-outline"></i></button>
                <button className="button-bare-primary">Duplicate <i className="manicon manicon-check-double"></i></button>
                <button className="button-bare-primary">Delete <i className="manicon manicon-trashcan"></i></button>
              </div>
            </div>
          </header>
        </div>
      </section>
    );
  }
}
