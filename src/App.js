import React, { lazy, Suspense } from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import MainContent from "./components/MainContent";
import Nav from "./components/Nav";
import QuickSearch from "./components/QuickSearch";
import Favourites from "../src/pages/Favourites";

const DiscoverPage = lazy(() => import("./pages/DiscoverPage"));
const MoviePage = lazy(() => import("./pages/MoviePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App(props) {
  return (
    <div className="App">
      <Nav />

      <MainContent className="App__main-content">
        <QuickSearch className="App__quicksearch" fullWidth fluid />

        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/" component={DiscoverPage} />
            <Route
              exact
              sensitive
              path="/movie/:id([1-9]\d{0,})"
              component={MoviePage}
            />
            <Route exact sensitive path="/favourites" component={Favourites} />
            <Route component={NotFoundPage} />
          </Switch>
        </Suspense>
      </MainContent>

      <Footer />
    </div>
  );
}

export default App;
