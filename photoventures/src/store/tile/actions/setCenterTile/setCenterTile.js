import { flickrRequest } from '../flickrRequest';

import { RADIAL_DRECTIONS } from '../../../../utilities/constants';
import { getTileCoords } from '../../../../utilities/functions';

export const SET_CENTER_TILE_START = 'SET_CENTER_TILE_START';
export const SET_CENTER_TILE_SUCCESS = 'SET_CENTER_TILE_SUCCESS';
export const SET_CENTER_TILE_FAILURE = 'SET_CENTER_TILE_FAILURE';
export const SET_RADIAL_TILE_SUCCESS = 'SET_RADIAL_TILE_SUCCESS';

export const setCenterTileStart = () => ({
  type: SET_CENTER_TILE_START,
});

export const setRadialTileSuccess = (direction, tileDetails) => ({
  type: SET_RADIAL_TILE_SUCCESS,
  direction,
  tileDetails,
});

export const setCenterTileSuccess = tileDetails => ({
  type: SET_CENTER_TILE_SUCCESS,
  tileDetails,
});

export const setCenterTileFailure = error => ({
  type: SET_CENTER_TILE_FAILURE,
  error,
});

const getAndSetRadialTiles = (dispatch, centerLat, centerLon, radius) => {
  RADIAL_DRECTIONS.forEach((direction) => {
    const { lat, lon } = getTileCoords(direction, centerLat, centerLon, radius);
    dispatch(flickrRequest(lat, lon)).then((src) => {
      const tileDetails = { lat, lon, src };
      dispatch(setRadialTileSuccess(direction, tileDetails));
    });
  });
};

export const setCenterTile = (newCenterTileDetails, radius) => (dispatch) => {
  console.log(newCenterTileDetails, radius);
  dispatch(setCenterTileStart());
  const { centerLat, centerLon, centerSrc } = newCenterTileDetails;

  console.log('getting for', centerLat, centerLon, centerSrc, radius);

  if (typeof centerSrc !== 'undefined') { // If an image is already loaded for a clicked radial tile, don't get a new image.
    dispatch(setCenterTileSuccess({ lat: centerLat, lon: centerLon, src: centerSrc }));
    getAndSetRadialTiles(dispatch, centerLat, centerLon, radius);
  } else {
    dispatch(flickrRequest(centerLat, centerLon)).then((src) => {
      const tileDetails = { lat: centerLat, lon: centerLon, src };
      dispatch(setCenterTileSuccess(tileDetails));
      getAndSetRadialTiles(dispatch, centerLat, centerLon, radius);
    });
  }
};
