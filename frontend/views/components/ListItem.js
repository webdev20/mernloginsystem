import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ListItem = props => {
  const thisClick = e => {
    e.stopPropagation();
    if (props.activePage || props.text) return e.preventDefault();
    e.value = props.value;
    return props.handleClick(e);
  };

  return (
    <li className={props.className} onClick={thisClick}>
      {!props.activePage && !props.text ? (
        <Link to={props.url} onClick={thisClick}>
          {props.content}
        </Link>
      ) : (
        <span>{props.content}</span>
      )}
    </li>
  );
};

ListItem.propTypes = {
  className: PropTypes.string,
  content: PropTypes.node.isRequired
};

export default ListItem;
