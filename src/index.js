import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, GeoJSON, FeatureGroup } from "react-leaflet";
import buffer from "@turf/buffer";
import { EditControl } from "react-leaflet-draw";
import "./styles.css";
import "./leaflet-measure";

const jsts = require("jsts");

const drawOptions = {
  metric: false,
  circle: false,
  circlemarker: false,
  marker: false,
  polyline: true,
  polygon: false,
  rectangle: false
};

const originalGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [3.686224222183228, 51.0394915294359],
            [3.6850869655609126, 51.03802759680128],
            [3.6881554126739498, 51.037245014762256],
            [3.689453601837158, 51.038816911848265],
            [3.686224222183228, 51.0394915294359]
          ]
        ]
      }
    }
  ]
};

const turfbuffer = buffer(originalGeojson, 100, "metres");

const geoReader = new jsts.io.GeoJSONReader();
const geoWriter = new jsts.io.GeoJSONWriter();
const geometry = geoReader
  .read(originalGeojson.features[0].geometry)
  .buffer(0.001);
const jstsBuffer = geoWriter.write(geometry);

class App extends Component {
  state = {
    center: [51.038391897724594, 3.6872863769531246],
    zoom: 17
  };

  render() {
    return (
      <div>
        <Map center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <FeatureGroup>
            <EditControl draw={drawOptions} position="topright" />
          </FeatureGroup>
          <GeoJSON data={originalGeojson} color="blue" opacity="1" />
          <GeoJSON data={turfbuffer} color="red" opacity="1" />
          <GeoJSON data={jstsBuffer} color="green" opacity="1" />
        </Map>
        Blauw = originele geojson.
        <br />
        Rood = buffer met turf.
        <br />
        Groen = buffer met jsts (JAVA library).
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
