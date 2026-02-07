import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import styles from "./SlidingMenu.module.css"; // Import the CSS module

import MemberInfoCard from "../../Assignment/MemberInfoCard";
import RoomLeadersContent from "./RoomLeadersContent";

const SlidingMenu = (props) => {
  const { isOpen, children, onChange } = props;

  const onClickHandler = () => {
    onChange(!isOpen);
  };
  function createCard(Contact) {
    return (
      <MemberInfoCard
        type={Contact.type}
        name={Contact.name}
        email={Contact.email}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Hamburger icon */}
      <div
        onClick={onClickHandler}
        className={cx(styles.hamburger, { [styles.active]: !isOpen })}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* sliding menu */}
      <div className={cx(styles.menu, { [styles.active]: !isOpen })}>
        {children}
        {RoomLeadersContent.map(createCard)}
      </div>
    </div>
  );
};

SlidingMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onChange: PropTypes.func.isRequired,
};

SlidingMenu.defaultProps = {
  isOpen: false,
};

export default SlidingMenu;
