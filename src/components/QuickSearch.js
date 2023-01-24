import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Search, Input, Icon } from "semantic-ui-react";
import { searchAPI } from "../api";
import { createImageSrc } from "../api/config";
import useDebounce from "../utils/hooks/useDebounce";
import useLocation from "../utils/hooks/useLocation";

function QuickSearch({ delay, fullWidth, className, ...rest }) {
  const { navigate } = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (!searchTerm) {
      resetComponent();
    }
  }, [searchTerm]);

  useEffect(() => {
    const trimmedDebouncedSearchTerm = debouncedSearchTerm.trim();
    if (trimmedDebouncedSearchTerm) {
      fetchResults(trimmedDebouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  async function fetchResults(searchTerm) {
    setLoading(true);

    const res = await searchAPI.searchMulti(searchTerm, {
      language: "en-US",
      region: "US",
      page: 1,
    });
    const results = res.results;
    const resultsMoviesAndPersons = results.filter(
      (result) => result.media_type !== "tv"
    );
    const first5Results = resultsMoviesAndPersons.slice(0, 5);

    const first5ResultsWithAs = first5Results.map((result, index) => {
      const data = {
        key: result.id,
        as: Link,
        "data-testid": `search-result-${index}`,
      };

      if (result.media_type === "movie") {
        data.title = result.title;
        data.description = result.release_date.split("-")[0];
        data.image = createImageSrc({
          path: result.poster_path,
          type: "poster",
          size: "w92",
        });
        data.to = `/movie/${result.id}`;
      }
      return data;
    });

    setLoading(false);
    setResults(first5ResultsWithAs);
  }

  function resetComponent() {
    setLoading(false);
    setResults([]);
  }

  function clearInput() {
    setSearchTerm("");
  }

  function handleResultSelect(e, data) {
    setSearchTerm("");
    navigate(data.result.to);
  }

  function handleSearchChange(e, { value }) {
    setSearchTerm(value);
  }

  return (
    <Search
      className={`QuickSearch ${className}`}
      input={
        <Input
          fluid={fullWidth}
          icon={
            searchTerm ? (
              <Icon name="delete" link onClick={clearInput} title="Clear" />
            ) : (
              <Icon name="search" />
            )
          }
        />
      }
      placeholder={"Search for a movie"}
      onResultSelect={handleResultSelect}
      onSearchChange={handleSearchChange}
      loading={loading}
      results={results}
      value={searchTerm}
      {...rest}
    />
  );
}

QuickSearch.propTypes = {
  delay: PropTypes.number,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

QuickSearch.defaultProps = {
  delay: 500,
  fullWidth: false,
  className: "",
};

export default QuickSearch;
