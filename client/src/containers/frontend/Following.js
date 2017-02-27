import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { ProjectList, Layout } from 'components/frontend';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { uiFilterActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI, favoriteProjectsAPI } from 'api';
import HigherOrder from 'containers/global/HigherOrder';
import get from 'lodash/get';

const { select } = entityUtils;
const { setProjectFilters } = uiFilterActions;
const { request, requests } = entityStoreActions;

class FollowingContainer extends Component {

  static fetchData(getState, dispatch) {
    const state = getState();
    if (state.authentication.authenticated) {
      const followedProjectsRequest =
        request(favoriteProjectsAPI.index(state.ui.projectFilters), requests.followedProjects);
      const featuredRequest =
        request(projectsAPI.featured(), requests.browseFeaturedProjects);
      const { promise: one } = dispatch(followedProjectsRequest);
      const { promise: two } = dispatch(featuredRequest);
      return Promise.all([one, two]);
    }
    return Promise.all([]);
  }

  static propTypes = {
    children: PropTypes.object,
    featuredProjects: PropTypes.array,
    followedProjects: PropTypes.array,
    projectFilters: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    authentication: PropTypes.object,
    subjects: PropTypes.array
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static mapStateToProps(state) {
    return {
      projectFilters: state.ui.filters.project,
      followedProjects: select(requests.followedProjects, state.entityStore),
      featuredProjects: select(requests.browseFeaturedProjects, state.entityStore),
      subjects: select(requests.allUsedSubjects, state.entityStore),
      authentication: state.authentication
    };
  }

  constructor() {
    super();
    this.renderFollowedProjects = this.renderFollowedProjects.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.authentication.authenticated) return;
    // Favorite projects filters changed?
    if (prevProps.projectFilters !== this.props.projectFilters) {
      this.updateFavorites();
    }
    // Favorites changed?
    if (prevProps.authentication.currentUser.favorites !==
      this.props.authentication.currentUser.favorites) {
      this.updateFavorites();
    }
  }

  updateFavorites() {
    const apiCall = favoriteProjectsAPI.index(this.props.projectFilters);
    const followedRequest = request(apiCall, requests.followedProjects);
    this.props.dispatch(followedRequest);
  }

  renderFollowedProjects() {
    const boundSetFilters = bindActionCreators(setProjectFilters, this.props.dispatch);

    return (
      <section className="bg-neutral05">
        <div className="container">
          <header className="section-heading utility-right">
            <h4 className="title">
              <i className="manicon manicon-books-with-glasses"></i>
              {'Projects You\'re Following'}
            </h4>
            <div className="section-heading-utility-right">
              <ProjectList.Filters
                updateAction={boundSetFilters}
                subjects={this.props.subjects}
              />
            </div>
          </header>
          { this.props.followedProjects ?
            <ProjectList.Grid
              authenticated={this.props.authentication.authenticated}
              favorites={get(this.props.authentication, 'currentUser.favorites')}
              dispatch={this.props.dispatch}
              projects={this.props.followedProjects}
            /> : null
          }
        </div>
      </section>
    );
  }

  render() {
    return (
      <HigherOrder.RequireRole requiredRole="any" redirect="/browse">
        <div>
          {this.props.followedProjects && this.props.followedProjects.length > 0 ?
              this.renderFollowedProjects() : <Layout.NoFollow />
          }
          <section>
            <div className="container">
              <header className="section-heading utility-right">
                <h4 className="title">
                  <i className="manicon manicon-lamp"></i>
                  {'Featured Projects'}
                </h4>
                {/* Commented out until functional
                <div className="section-heading-utility-right">
                  <Link to={`/browse/`} className="button-primary">
                    See all Featured
                  </Link>
                </div> */}
              </header>
              { this.props.featuredProjects ?
                <ProjectList.Grid
                  authenticated={this.props.authentication.authenticated}
                  favorites={get(this.props.authentication, 'currentUser.favorites')}
                  dispatch={this.props.dispatch}
                  projects={this.props.featuredProjects}
                /> : null
              }
            </div>
          </section>
          <Layout.ButtonNavigation grayBg showFollowing={false} />
        </div>
      </HigherOrder.RequireRole>
    );
  }
}

const Following = connect(
  FollowingContainer.mapStateToProps
)(FollowingContainer);

export default Following;
