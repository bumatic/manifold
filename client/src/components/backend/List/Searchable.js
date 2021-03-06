import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Utility } from "components/global";
import { List } from "components/backend";
import { Link } from "react-router-dom";
import get from "lodash/get";
import classnames from "classnames";

export default class ListSearchable extends PureComponent {
  static displayName = "List.Searchable";

  static propTypes = {
    entities: PropTypes.array,
    listClassName: PropTypes.string,
    singularUnit: PropTypes.string,
    pluralUnit: PropTypes.string,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    entityComponentProps: PropTypes.object,
    entityComponent: PropTypes.func.isRequired,
    paginationPadding: PropTypes.number,
    newButtonText: PropTypes.string,
    newButtonVisible: PropTypes.bool,
    newButtonPath: PropTypes.string,
    newButtonType: PropTypes.string,
    filterOptions: PropTypes.object,
    destroyHandler: PropTypes.func,
    filterChangeHandler: PropTypes.func,
    secondaryButtonIcon: PropTypes.string,
    secondaryButtonVisible: PropTypes.bool,
    secondaryButtonPath: PropTypes.string,
    secondaryButtonType: PropTypes.string,
    secondaryButtonText: PropTypes.string
  };

  static defaultProps = {
    entityComponentProps: {},
    newButtonText: "Add new",
    newButtonVisible: false,
    paginationPadding: 3
  };

  constructor(props) {
    super(props);

    this.state = this.initialState();
    this.setKeyword = this.setKeyword.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.renderEntityList = this.renderEntityList.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, "filter") !== get(this.state, "filter")) {
      this.props.filterChangeHandler(this.state.filter);
    }
  }

  setKeyword(event) {
    const keyword = event.target.value;
    const filter = Object.assign({}, this.state.filter);
    if (keyword === "") {
      delete filter.keyword;
      delete filter.typeahead;
    } else {
      filter.keyword = keyword;
      filter.typeahead = true;
    }
    this.setState({ inputs: { keyword }, filter });
  }

  setFilters(event, label) {
    event.preventDefault();
    const value = event.target.value;
    const filter = Object.assign({}, this.state.filter);
    const inputs = Object.assign({}, this.state.inputs);
    if (value && label) {
      switch (value) {
        case "default":
          delete filter[label];
          inputs[label] = "default";
          break;
        default:
          filter[label] = value;
          inputs[label] = value;
          break;
      }
      this.setState({ inputs, filter });
    }
  }

  toggleOptions(event) {
    event.preventDefault();
    this.setState({ showOptions: !this.state.showOptions });
  }

  resetSearch(event) {
    event.preventDefault();
    this.setState(this.initialState());
  }

  initialInputs() {
    const out = { keyword: "" };
    const keys = Object.keys(this.props.filterOptions);
    keys.forEach(key => {
      out[key] = false;
    });
    return out;
  }

  initialState() {
    const inputs = this.props.filterOptions
      ? this.initialInputs()
      : { keyword: "" };
    return {
      inputs,
      filter: {}
    };
  }

  handleSubmit = event => {
    event.preventDefault();
  };

  renderOptionsText() {
    if (this.state.showOptions) return `Hide Search Options`;
    return `Show Search Options`;
  }

  renderFilterList() {
    if (!this.state.showOptions || !this.props.filterOptions) return null;
    const out = [];
    Object.keys(this.props.filterOptions).forEach((filter, index) => {
      out.push(this.renderFilterSelect(filter, index));
    });
    return out;
  }

  renderFilterSelect(filter, index) {
    return (
      <div className="select" key={index}>
        <select
          onChange={event => this.setFilters(event, filter)}
          value={this.state.inputs[filter]}
          data-id={"filter"}
        >
          <option value="default">{`${filter}:`}</option>
          {this.renderFilterOptions(this.props.filterOptions[filter])}
        </select>
        <i className="manicon manicon-caret-down" />
      </div>
    );
  }

  renderFilterOptions(filter) {
    const options = filter.options || filter;
    const out = [];
    options.map(option => {
      const label = this.renderOptionLabel(option, filter);
      return out.push(
        <option key={option} value={option}>
          {label}
        </option>
      );
    });
    return out;
  }

  renderOptionLabel(option, filter) {
    if (!filter.labels || !filter.labels[option]) return option;
    return filter.labels[option];
  }

  renderEntityList() {
    const entities = this.props.entities;
    if (!entities) return;

    const secondaryButtonIcon = this.props.secondaryButtonIcon
      ? this.props.secondaryButtonIcon
      : "manicon-plus";

    let output = null;

    output = (
      <div>
        <Utility.EntityCount
          pagination={this.props.pagination}
          singularUnit={this.props.singularUnit}
          pluralUnit={this.props.pluralUnit}
        />
        <div className="buttons-icon-horizontal">
          {this.props.newButtonVisible ? (
            <Link
              to={this.props.newButtonPath}
              className={`button-icon-secondary ${this.props.newButtonType}`}
            >
              <i className="manicon manicon-plus" />
              {this.props.newButtonText}
            </Link>
          ) : null}
          {this.props.secondaryButtonVisible ? (
            <Link
              to={this.props.secondaryButtonPath}
              className={`button-icon-secondary ${
                this.props.secondaryButtonType
              }`}
            >
              <i className={`manicon ${secondaryButtonIcon}`} />
              {this.props.secondaryButtonText}
            </Link>
          ) : null}
        </div>
        {entities.length > 0 ? (
          <List.SimpleList
            entities={entities}
            entityComponent={this.props.entityComponent}
            entityComponentProps={this.props.entityComponentProps}
            destroyHandler={this.props.destroyHandler}
          />
        ) : (
          <p className="list-total empty">Sorry, no results were found.</p>
        )}
      </div>
    );

    return output;
  }

  render() {
    const listClassName = classnames(
      "vertical-list-primary",
      this.props.listClassName
    );

    return (
      <div>
        <form className="form-search-filter" onSubmit={this.handleSubmit}>
          <div className="search">
            <button>
              <i className="manicon manicon-magnify" />
              <span className="screen-reader-text">Click to search</span>
            </button>
            <input
              value={this.state.inputs.keyword}
              type="text"
              placeholder="Search..."
              onChange={this.setKeyword}
            />
          </div>
          <div className="form-list-filter">
            <div className="select-group">{this.renderFilterList()}</div>
          </div>
          {this.props.filterOptions ? (
            <button
              onClick={this.toggleOptions}
              className="button-bare-primary"
              data-id={"filter-toggle"}
            >
              {this.renderOptionsText()}
            </button>
          ) : null}
          <button
            onClick={this.resetSearch}
            className="button-bare-primary reset"
          >
            {"Reset Search"}
          </button>
        </form>
        <nav className={listClassName}>{this.renderEntityList()}</nav>
        <Utility.Pagination
          pagination={this.props.pagination}
          padding={this.props.paginationPadding}
          paginationClickHandler={this.props.paginationClickHandler}
        />
      </div>
    );
  }
}
