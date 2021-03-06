import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import PrevNextBtn from "./PrevNextBtn";
import { isArray } from "util";

class Pagination extends Component {
  generateListItem = (activeNum, endPage, limit) => {
    if (endPage == 1) return endPage;

    limit = limit || 2; // Left and right limit counted from the active page
    const list = []; // Container to collect the entire list items
    const middle = []; // Container to collect middle page numbers
    const middleLength = limit * 2 + 1; // Middle page numbers list's length
    const oneSideLength = middleLength + 1; // Left or right page numbers list's length
    const entireLength = middleLength + 2; // Length of the displayed page numbers
    // Keep the middle number's length == (limit left length + limit right length + middle length)
    const pageDown = Math.min(activeNum - limit, endPage - middleLength);
    const pageUp = Math.max(activeNum + limit, oneSideLength);
    const limitDown = Math.max(2, pageDown);
    const limitUp = Math.min(endPage - 1, pageUp);
    const text = "dots";
    let item = null;
    let isActive = false;

    // Create first page
    let firstPage;
    if (activeNum == 1) {
      firstPage = <ListItem className={"list-item active-page"} text={true} key={1} content={1} />;
    } else {
      firstPage = (
        <ListItem
          className={"list-item"}
          activePage={false}
          key={1}
          content={1}
          handleClick={this.props.handleClick}
          url={"/members/" + 1}
          value={1}
        />
      );
    }

    // Create last page
    let lastPage;
    if (activeNum == endPage) {
      lastPage = (
        <ListItem className={"list-item active-page"} text={true} key={endPage} content={endPage} />
      );
    } else {
      lastPage = (
        <ListItem
          className={"list-item"}
          activePage={false}
          key={endPage}
          content={endPage}
          handleClick={this.props.handleClick}
          url={"/members/" + endPage}
          value={endPage}
        />
      );
    }

    // Add first and last page to the list array.
    list.push(firstPage, lastPage);

    // Generate middle pages
    for (let num = limitDown; num <= limitUp; num++) {
      isActive = activeNum == num;
      item = (
        <ListItem
          className={"list-item" + (isActive ? " active-page" : "")}
          activePage={isActive}
          key={num}
          content={num}
          handleClick={this.props.handleClick}
          url={"/members/" + num}
          value={num}
        />
      );
      middle.push(item);
    }
    // Add the middle array to the list array
    list.splice(1, 0, ...middle);

    // Determine where to give the dots
    // The front dots
    if (limitDown > 2 && endPage > entireLength) {
      list.splice(
        1,
        0,
        <ListItem className="list-item" key={text + 1} content="..." text={true} />
      );
    }
    // The back dots
    if (limitUp < endPage - 1 && endPage > entireLength) {
      list.splice(
        list.length - 1,
        0,
        <ListItem className="list-item" key={text + 2} content="..." text={true} />
      );
    }

    // Spit out the result
    return list;
  };

  // Memoize Pagination
  /*
   * This method stores up to 10 generated pagination on cache object.
   * Everytime the cache object's value reach maximum amount (10), the first value will be deleted.   *
   */
  cache = {};
  memoizePagination = (activeNum, endPage) => {
    const objKeys = Object.keys(this.cache);
    if (objKeys.length == 10) {
      delete this.cache[objKeys[0]];
    }
    if (endPage == 0) {
      return this.generateListItem(activeNum, endPage);
    }
    if (!this.cache[activeNum]) {
      this.cache[activeNum] = this.generateListItem(activeNum, endPage);
    }
    return this.cache[activeNum];
  };

  render() {
    let { pagenum, pageLength, handleClick } = this.props;
    const list = this.memoizePagination(pagenum, pageLength);
    if (!isArray(list)) {
      return null;
    }

    return (
      <Fragment>
        <PrevNextBtn
          text="Prev"
          handleClick={handleClick}
          value={pagenum - 1}
          active={pagenum - 2 < 0}
        />
        <ul className="pagination">{list}</ul>
        <PrevNextBtn
          text="Next"
          handleClick={handleClick}
          value={pagenum + 1}
          active={pagenum + 1 > pageLength}
        />
      </Fragment>
    );
  }
}

Pagination.propTypes = {
  pageLength: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Pagination;
