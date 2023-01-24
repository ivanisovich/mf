import React, { useEffect, useState } from "react";
import "../styles/HomePage.css";
import _get from "lodash/get";
import { Link } from "react-router-dom";
import { Header } from "semantic-ui-react";
import MovieCard from "../components/MovieCard";

const getFavourites = () => {
  return Object.values(JSON.parse(localStorage.getItem("favourites")));
};

function Favourites({}) {
  const [isUpdated, setIsUpdated] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const handleDelete = () => {
    setIsUpdated(true);
  };

  useEffect(() => {
    setFavourites(getFavourites());
    setIsUpdated(false);
  }, [isUpdated]);

  return (
    <div data-testid="home-page">
      <Header size="huge" textAlign="center" dividing>
        Bookmarks
        <Header.Subheader>
          Keep your favourite films in one place !
        </Header.Subheader>
      </Header>
      {favourites && favourites.length > 0 ? (
        <div className="Favourites__container">
          {favourites.map((item) => {
            return (
              <MovieCard
                movie={item}
                type="poster"
                as={Link}
                key={item.id}
                to={`/movie/${item.id}`}
                data-testid="movie-card"
                deleteHandler={handleDelete}
              />
            );
          })}
        </div>
      ) : (
        <h1>No bookmarks</h1>
      )}
    </div>
  );
}

export default Favourites;
