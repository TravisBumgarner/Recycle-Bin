/* eslint-disable */

import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { connect } from 'react-redux';

import { CENTER_DIRECTION } from '../../utilities/constants';

const icon = (fillOpacity) => {
  return {
    path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
    fillColor: 'rgb(64, 224, 208)',
    fillOpacity,
    strokeWeight: 2,
    strokeColor: 'rgb(64, 224, 208)',
    scale: 0.3,
  };
};

const MyMapComponent = compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBGM37DlAcV8oLUNewkPs3e8XSBDQVXOQM&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%', width: '100%', padding: '10px' }} />, // TODO this shoudl live elsewhere
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)((props) =>
  <GoogleMap
    defaultZoom={14}
    defaultCenter={{ lat: props.lat, lng: props.lon }}
    center={{ lat: props.lat, lng: props.lon }}
    disableDefaultUI={true}
  >
    { props.markers }
  </GoogleMap>
)

class Map extends Component {
  constructor(props) {
    super(props);
  }

  createMarkers = () => {
    const { history } = this.props;
    const markers = history.map((item, idx) => {
      const fillOpacity = ( idx + 1) / history.length;
      return (
        <Marker
          position={{ lat: item.lat, lng: item.lon }}
          key={ fillOpacity }
          icon={icon(fillOpacity)}
        />
      )
    });
    return markers;
  };

  render() {
    const { centerTile: { lat, lon }, width, height } = this.props;
    const markers = this.createMarkers();
    return (
      <MyMapComponent
        lat={lat}
        lon={lon}
        markers={markers}
        width={width}
        height={height}
      />
    )
  }
}

export default connect(state => ({
  centerTile: state.tile.allTiles[CENTER_DIRECTION],
  history: state.tile.history,
}), {
})(Map);
