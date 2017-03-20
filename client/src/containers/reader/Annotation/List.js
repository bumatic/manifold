import React, { PureComponent, PropTypes } from 'react';
import Annotation from 'components/reader/Annotation';
import { connect } from 'react-redux';
import { annotationsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { Utility } from 'components/frontend';
const { request, flush } = entityStoreActions;
const { select, meta } = entityUtils;
import { hash } from 'utils/string';

class AnnotationList extends PureComponent {

  static displayName = "Annotation.List";

  static propTypes = {
    annotations: PropTypes.array,
    annotationIds: PropTypes.array.isRequired,
    createHandler: PropTypes.func.isRequired
  }

  static defaultProps = {
    annotations: []
  }

  static mapStateToProps(state, ownProps) {
    const newState = {
      annotations: select(requests.rDrawerAnnotations, state.entityStore) || [],
    };
    return Object.assign({}, newState, ownProps);
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchAnnotations(this.props);
  }

  /* eslint-disable no-param-reassign */
  annotationsGroupedBySubject() {
    const grouped = this.props.annotations.reduce((memo, annotation) => {
      const key = hash(annotation.attributes.subject.trim());
      if (!memo.hasOwnProperty(key)) {
        memo[key] = {
          annotations: [],
          selection: {
            hash: key,
            subject: annotation.attributes.subject,
            startNode: annotation.attributes.startNode,
            startChar: annotation.attributes.startChar,
            endNode: annotation.attributes.endNode,
            endChar: annotation.attributes.endChar
          }
        };
      }
      memo[key].annotations.push(annotation);
      return memo;
    }, {});
    return Object.values(grouped);
  }
  /* eslint-enable no-param-reassign */

  fetchAnnotations(props) {
    const sId = this.props.sectionId;
    const annotationsCall = annotationsAPI.forSection(sId, { ids: this.props.annotationIds });
    props.dispatch(request(annotationsCall, requests.rDrawerAnnotations));
  }

  render() {

    const grouped = this.annotationsGroupedBySubject();

    return (
      <div>
        <ul className="selection-list">
          {grouped.map((group) => {
            return (
              <li key={group.selection.hash} className="annotation-detail">
                <Annotation.Selection.Wrapper
                  {...group.selection}
                  truncate={250}
                  createHandler={this.props.createHandler}
                />
                <div className="container">
                  <ul className="annotation-list">
                    {group.annotations.map((annotation) => {
                      const creator = annotation.relationships.creator;
                      return (
                        <Annotation.Annotation
                          key={annotation.id}
                          creator={creator}
                          annotation={annotation}
                        />
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default connect(
  AnnotationList.mapStateToProps
)(AnnotationList);