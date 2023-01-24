import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../styles/MoviePage.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Flag, Grid, Header, Image, Label, List } from "semantic-ui-react";
import Loader from "../components/Loader";
import NotFound from "../components/NotFound";
import Rating from "../components/Rating";
import {
  createImageSrc,
  findLanguageNameInEnglishFromISO,
} from "../api/config";
import { formatDate } from "../utils/date";
import extractReleaseDatesForRegion from "../utils/extractReleaseDatesForRegion";
import { loadMovieInfo } from "../redux/actions/movieActions";
import MovieCard from "../components/MovieCard";

function MoviePage({ movieId, movie, isFetching, loadMovieInfo }) {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    console.log(1);
    let favourites = JSON.parse(localStorage.getItem("favourites"));
    if (favourites) {
      if (movieId in favourites) {
        setIsFavourite(true);
      } else {
        setIsFavourite(false);
      }
    }
    loadMovieInfo(
      movieId,
      {
        appendToResponse: ["similar", "credits", "release_dates"],
      },
      ["imdb_id"]
    );
  }, [loadMovieInfo, movieId]);

  const handleAddBookmark = (e) => {
    e.preventDefault();
    let favourites = JSON.parse(localStorage.getItem("favourites"));

    if (!favourites) {
      favourites = {};
      favourites[movie.id] = movie;
      localStorage.setItem("favourites", JSON.stringify(favourites));
      setIsFavourite(true);
    } else {
      if (movie.id in favourites) {
        delete favourites[movie.id];
        setIsFavourite(false);
      } else {
        favourites[movie.id] = movie;
        setIsFavourite(true);
      }
      localStorage.setItem("favourites", JSON.stringify(favourites));
    }
  };
  if (isFetching) {
    return <Loader />;
  }

  if (!movie) {
    return <NotFound />;
  }

  const {
    title,
    overview,
    release_date: releaseDate,
    poster_path: imagePath,
    vote_average: voteAverage,
    vote_count: voteCount,
    status,
    original_language: originalLanguage,
    runtime,
    budget,
    revenue,
    similar,
    genres,
  } = movie;

  const titleDate = releaseDate ? `(${releaseDate.split("-")[0]})` : "";
  const releaseDates = extractReleaseDatesForRegion(movie, "US");
  const rating = voteCount > 0 ? voteAverage : -1;
  const similarMovies = Object.values(similar);

  return (
    <div className="MoviePage" data-testid="movie-page">
      {isFavourite ? (
        <button
          className="MoviePage_bookmark added"
          onClick={handleAddBookmark}
        >
          Delete from bookmark
        </button>
      ) : (
        <button className="MoviePage_bookmark" onClick={handleAddBookmark}>
          Add to bookmarks
        </button>
      )}
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={6}>
            <div className="MoviePage__info__picture-container">
              <Image
                className="MoviePage__info__picture"
                src={createImageSrc({
                  path: imagePath,
                  type: "poster",
                  size: "w500",
                })}
              />
            </div>
          </Grid.Column>
          <Grid.Column width={10}>
            <div className="MoviePage__title">
              <Header size="huge" className="MoviePage__title__name">
                {title}{" "}
                <span className="MoviePage__title__year">{titleDate}</span>
              </Header>
            </div>
            <div className="MoviePage__actions">
              <Rating value={rating} />
            </div>
            <div className="MoviePage__overview">
              <Header size="medium" className="MoviePage__overview__header">
                Overview
              </Header>
              <div className="MoviePage__overview__content">
                {overview || "There is not an overview yet."}
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div className="MoviePage__facts">
              <Header size="medium" className="MoviePage__facts_header">
                Facts
              </Header>

              <List relaxed="very">
                <List.Item>
                  <List.Header>Status</List.Header>
                  {status}
                </List.Item>
                <List.Item>
                  <List.Header>Release Information</List.Header>
                  {releaseDates.length > 0
                    ? releaseDates.map((date) => (
                        <List.Item key={movie.id}>
                          <Flag name={"US".toLowerCase()} />
                          {formatDate(date)}
                        </List.Item>
                      ))
                    : "-"}
                </List.Item>
                <List.Item>
                  <List.Header>Original Language</List.Header>
                  {findLanguageNameInEnglishFromISO(originalLanguage)}
                </List.Item>
                <List.Item>
                  <List.Header>Runtime</List.Header>
                  {runtime
                    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
                    : "-"}
                </List.Item>
                <List.Item>
                  <List.Header>Budget</List.Header>
                  {budget
                    ? `$${budget.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : "-"}
                </List.Item>
                <List.Item>
                  <List.Header>Revenue</List.Header>
                  {revenue
                    ? `$${revenue.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : "-"}
                </List.Item>
                <List.Item>
                  <List.Header>Genres</List.Header>
                  <Label.Group tag color="blue">
                    {genres && genres.length > 0
                      ? genres // TMDb API returns duplicate genre objects, so remove them
                          .filter(
                            (genre, index, arr) =>
                              arr
                                .map((mapObj) => mapObj.id)
                                .indexOf(genre.id) === index
                          )
                          .map((genre) => (
                            <Label key={genre.id}>{genre.name}</Label>
                          ))
                      : "No genres have been added."}
                  </Label.Group>
                </List.Item>
              </List>
            </div>
          </Grid.Column>
        </Grid.Row>
        <h1 id="similar">Similar Films</h1>
        <div className="Similar__container">
          {similarMovies[1].map((item) => {
            return (
              <MovieCard
                movie={item}
                type="poster"
                as={Link}
                key={item.id}
                to={`/movie/${item.id}`}
                data-testid="movie-card"
              />
            );
          })}
        </div>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  const movieId = parseInt(ownProps.match.params.id);
  const cachedMovies = state.entities.movies;
  const movie = cachedMovies[movieId] || {};
  const isFetching = typeof movie.imdb_id === "undefined";
  console.log(state);
  return {
    movieId,
    movie,
    isFetching,
  };
};

MoviePage.propTypes = {
  movieId: PropTypes.number.isRequired,
  movie: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  loadMovieInfo: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { loadMovieInfo })(MoviePage);
