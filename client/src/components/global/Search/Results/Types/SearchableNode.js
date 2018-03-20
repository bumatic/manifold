import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import get from "lodash/get";
import { Link } from "react-router-dom";
import { Text } from "components/global";

export default class SearchResultsTypeAnnotation extends PureComponent {
  static displayName = "Search.Results.Type.SearchableNode";

  static propTypes = {
    result: PropTypes.object,
    context: PropTypes.string,
    typeLabel: PropTypes.string,
  };

  render() {
    const { result } = this.props;
    const { textSection } = result.relationships;

    // Get result context to show additional
    // meta information outside the origin text
    const showMeta =
      this.props.context === 'frontend';

    const url = lh.link(
      "readerSection",
      textSection.attributes.textSlug,
      textSection.id
    );
    return (
      <li className="result-text-node" key={result.id}>
        <Link
          to={`${url}#node-${result.attributes.nodeUuid}`}
          className="result"
        >
          <div className="body">
            { showMeta ?
              <header>
                <h4 className="title">
                  {textSection.attributes.textTitle}: {textSection.attributes.name}
                </h4>
                <p className="subtitle">
                  {'Project: Project Name'}
                  <span>
                    {'Text: Text Title'}
                  </span>
                </p>
              </header> : null
            }
            <p
              className="with-highlights"
              dangerouslySetInnerHTML={{
                __html: `\u2026 ${result.attributes.highlightedBody}\u2026`
              }}
              />
          </div>
          {showMeta ?
            <div className="marker tertiary">
              {this.props.typeLabel}
            </div> : null
          }
        </Link>
      </li>
    );
  }
}
