import { createServerFn } from "@tanstack/react-start";

import { requireOwnerMiddleware } from "#/features/auth/auth.middleware";

import {
  createMovie,
  deleteMovie,
  getMovies,
  setMovieActive,
  updateMovie,
} from "./movies.services";
import {
  createMoviesSchema,
  movieIdSchema,
  toggleMoviesActiveSchema,
  updateMoviesSchema,
} from "./movies.schema";

export const getMoviesFn = createServerFn({
  method: "GET",
})
  .middleware([requireOwnerMiddleware])
  .handler(async () => {
    return getMovies();
  });

export const createMovieFn = createServerFn({
  method: "POST",
})
  .middleware([requireOwnerMiddleware])
  .validator(createMoviesSchema)
  .handler(async ({ data }) => {
    return createMovie(data);
  });

export const updateMovieFn = createServerFn({
  method: "POST",
})
  .middleware([requireOwnerMiddleware])
  .validator(updateMoviesSchema)
  .handler(async ({ data }) => {
    return updateMovie(data.id, data.data);
  });

export const deleteMovieFn = createServerFn({
  method: "POST",
})
  .middleware([requireOwnerMiddleware])
  .validator(movieIdSchema)
  .handler(async ({ data }) => {
    return deleteMovie(data.id);
  });

export const toggleMovieActiveFn = createServerFn({
  method: "POST",
})
  .middleware([requireOwnerMiddleware])
  .validator(toggleMoviesActiveSchema)
  .handler(async ({ data }) => {
    return setMovieActive(data.id, data.isActive);
  });
