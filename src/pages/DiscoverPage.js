import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CollectionGrid from "../components/CollectionGrid";
import Pagination from "../components/Pagination";
import MovieCard from "../components/MovieCard";
import MovieCardPlaceholder from "../components/MovieCardPlaceholder";
import {
  getFilters,
  getPage,
  stringifyFilters,
  updateQueryString,
} from "../utils/queryString";
import { discoverMovies } from "../redux/actions/movieActions";

function DiscoverPage({
  page,
  movies,
  pagination,
  history,
  location,
  discoverMovies,
}) {

  useEffect(() => {
    discoverMovies({
      page,
    });
  }, [discoverMovies,  page]);

  function handlePageChange(e, data) {
    const newQueryString = updateQueryString(location.search, {
      page: data.activePage,
    });
    history.push(`?${newQueryString}`);
  }

  function renderItem(movie) {
    return (
      <MovieCard
        movie={movie}
        type="poster"
        as={Link}
        to={`/movie/${movie.id}`}
        data-testid="movie-card"
      />
    );
  }

  function renderPlaceholderItem() {
    return <MovieCardPlaceholder />;
  }

  const { totalPages, selectedPageData } = pagination;
  const { isFetching } = selectedPageData;

  const shouldRenderPagination = totalPages > 1 && page <= totalPages;

  return (
    
    <div className="DiscoverPage" data-testid="discover-page">

      <h2 className="DiscoverPage__title">Popular Movies</h2>

      <div className="DiscoverPage__movies-container">
        <CollectionGrid
          collection={movies}
          renderItem={renderItem}
          placeholderItemsCount={20}
          renderPlaceholderItem={renderPlaceholderItem}
          loading={isFetching}
          columns={4}
          doubling
        />
      </div>

      {shouldRenderPagination && (
        <Pagination
          activePage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          topPadded
          disabled={isFetching}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const filters = getFilters(ownProps.location.search);
  const query = stringifyFilters(filters);
  const page = getPage(ownProps.location.search);
  const cachedMovies = state.entities.movies;
  const pagination = state.pagination.moviesByDiscoverOptions[query] || {
    pages: {},
  };
  const selectedPageData = pagination.pages[page] || { ids: [] };
  const movies = selectedPageData.ids.map((id) => cachedMovies[id]);

  return {
    movies,
    page,
    pagination: {
      totalPages: pagination.totalPages,
      selectedPageData,
    },
    filters,
  };
};

DiscoverPage.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  page: PropTypes.number,
  pagination: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  discoverMovies: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { discoverMovies })(DiscoverPage);
