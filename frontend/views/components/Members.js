import qs from "query-string";
import React, { Component, Fragment } from "react";
import { list } from "./../../apis/user-api";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import bigloader from "./../../img/bigloader.gif";

class Members extends Component {
  constructor(props) {
    super(props);
    const defaultLimit = 2;
    const query = qs.parse(props.location.search);
    const limit = query.pp || query.perPage || defaultLimit;
    const pagenum = query.pn || query.pageNum || 1;

    this.state = {
      users: [],
      limit,
      defaultLimit,
      pagenum,
      total: 0,
      loading: true,
      pageTitle: "Members"
    };
  }

  componentDidMount() {
    document.title = this.props.title;
    const { limit, pagenum, defaultLimit } = this.state;
    const query = "?perPage=" + limit + "&pageNum=" + pagenum;

    list({ query }).then(data => {
      if (data.error) {
        return this.setState({ error: data.error });
      }
      const total = Math.ceil(data.total / limit);
      return this.setState({ loading: false, total, users: data.users });
    });
  }

  handleClick = e => {
    e.preventDefault();
    this.setState({
      pagenum: e.value,
      loading: true
    });

    const query = "?perPage=" + this.state.limit + "&pageNum=" + e.value;
    list({ query }).then(data => {
      if (data.error) {
        return this.setState({ error: data.error });
      }
      if (history.pushState) {
        history.pushState(null, "", "/members/" + query);
      }
      document.title = `Members | Page ${e.value}`;
      const total = Math.ceil(data.total / this.state.limit);
      return this.setState({
        loading: false,
        users: data.users,
        total
      });
    });
  };

  render() {
    if (this.state.users.length == 0) {
      return <div> No data found...! </div>;
    }

    return (
      <div>
        <div id="member-list">
          {this.state.loading && (
            <div id="loading-background">
              <img src={bigloader} alt="big loading gif" />
            </div>
          )}
          {!this.state.loading &&
            this.state.users.map((user, index) => {
              return (
                <div key={user._id} className="user-item">
                  {index +
                    1 +
                    ((parseInt(this.state.pagenum) - 1) * parseInt(this.state.limit) || 0) +
                    ". " +
                    user.username}{" "}
                  <Link to={"/profile/" + user._id}>
                    <button>details</button>
                  </Link>
                  <hr />
                </div>
              );
            })}
        </div>

        <Pagination
          handleClick={this.handleClick}
          pageLength={this.state.total}
          pagenum={this.state.pagenum}
        />
      </div>
    );
  }
}

export default Members;
