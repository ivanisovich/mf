import React from "react";
import PropTypes from "prop-types";
import "../styles/Pagination.css";
import { Pagination as PaginationSUI } from "semantic-ui-react";
import classNames from "classnames";

function Pagination({
  activePage,
  totalPages,
  onPageChange,
  topPadded,
  bottomPadded,
  disabled,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const className = classNames("Pagination", {
    "Pagination--top-padded": topPadded,
    "Pagination--bottom-padded": bottomPadded,
  });

  return (
    <div className={className} data-testid="pagination">
      <PaginationSUI
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        firstItem={null}
        lastItem={null}
        disabled={disabled}
        pageItem={(Component, props) => (
          <Component
            {...props}
            data-testid={(props.active && "pagination-active-page") || null}
          />
        )}
      />
    </div>
  );
}

Pagination.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  topPadded: PropTypes.bool,
  bottomPadded: PropTypes.bool,
  disabled: PropTypes.bool,
};

Pagination.defaultProps = {
  onPageChange: () => {},
  topPadded: false,
  bottomPadded: false,
  disabled: false,
};

export default Pagination;
