import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/MovieCard.css";
import { Card, Image } from "semantic-ui-react";
import Rating from "./Rating";
import { createImageSrc } from "../api/config";
import { formatDate } from "../utils/date";
import { truncateOverview } from "../utils/movieCard";

const genres = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

function MovieCard({ movie, type, showOverview, className , deleteHandler, ...rest}) {
  const {
    title,
    release_date: date,
    poster_path: posterPath,
    backdrop_path: backdropPath,
    vote_average: voteAverage,
    vote_count: voteCount,
    overview,
  } = movie;

  const [isFavourite, setIsFavourite] = useState(false);
  useEffect(() => {
    let favourites = JSON.parse(localStorage.getItem("favourites"));
    if (favourites) {
      if (movie.id in favourites) {
        setIsFavourite(true);
      }
    }
  }, []);

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
        deleteHandler();
      } else {
        favourites[movie.id] = movie;
        setIsFavourite(true);
      }
      localStorage.setItem("favourites", JSON.stringify(favourites));
    }
  };

  return (
    <Card
      className={`MovieCard MovieCard--${type} ${className}`}
      fluid
      {...rest}
    >
      {isFavourite ? (
        <button className="bookmark added" onClick={handleAddBookmark}>
          Delete from bookmark
        </button>
      ) : (
        <button className="bookmark" onClick={handleAddBookmark}>
          Add to bookmarks
        </button>
      )}

      <Image
        className="MovieCard__image"
        src={createImageSrc({
          path: type === "poster" ? posterPath : backdropPath,
          type,
          size: type === "poster" ? "w500" : "w780",
        })}
      />
      <Card.Content>
        <Card.Header>
          <div className="MovieCard__title" title={title}>
            {title}
          </div>
        </Card.Header>
        <Card.Meta>
          <div className="MovieCard__date">{formatDate(date)}</div>
          <div className="MovieCard__rating">
            <Rating value={voteCount > 0 ? voteAverage : -1} />
          </div>
        </Card.Meta>
        {showOverview && (
          <Card.Description>
            <div className="MovieCard__overview">
              {truncateOverview(overview)}
            </div>
          </Card.Description>
        )}
        <div className="genres">
          {movie && movie.genre_ids ? (
            <>
              {movie.genre_ids.map((item) => {
                return (
                  <span key={item} id="genre">
                    {genres[item]}
                  </span>
                );
              })}
            </>
          ) : (
            ""
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["poster", "backdrop"]),
  showOverview: PropTypes.bool,
  className: PropTypes.string,
};

MovieCard.defaultProps = {
  type: "poster",
  showOverview: false,
  className: "",
  deleteHandler: ()=>{}
};

export default MovieCard;
