import React, { Component } from 'react';

const CANVAS = {WIDTH: 500, HEIGHT: 500};

const TOWNS = [
   {
       name: "loot_lake",
       x: 200,
       y: 200,
       distance: -1,
   },
   {
      name: "dusty_divot",
      x: 50,
      y: 250,
      distance: -1,
   },
   {
      name: "wailing_woods",
      x: 25,
      y: 100,
      distance: -1,
    },
];

export default class Canvas extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        x1: 0,
        x2: CANVAS.WIDTH,
        y1: 0,
        y2: CANVAS.HEIGHT,
      }
  }

  componentDidMount() {
    const canvas = this.refs.canvas;

    canvas.addEventListener('mousedown', (e) => {
      this.setState({
        x1: e.clientX,
        y1: e.clientY,
      });
    }, false);

    canvas.addEventListener('mouseup', (e) => {
      this.setState({
        x2: e.clientX,
        y2: e.clientY
      });
      // this.drawLine();
      // this.calculateDistances();
      // this.drawTowns();
      this.updateCanvas();
    }, false);
  }

  drawTowns = () => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle="black";
    ctx.font = "10px Arial";

    TOWNS.map((t)=> {

        ctx.fillText(`${t.name}`, t.x + 8, t.y + 8);

        ctx.beginPath();
        ctx.arc(t.x, t.y, 5, 0, 2*Math.PI);
        ctx.stroke();
    });
  }

  drawLine = (ctx, x1, y1, x2, y2, color) => {
    ctx.fillStyle= color;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();


    ctx.fillText(`${parseInt(x1, 10)} ${parseInt(y1, 10)}`, x1, y1);
    ctx.fillText(`${parseInt(x2, 10)} ${parseInt(y2, 10)}`, x2, y2);
  };

  clearCanvas = (ctx) => {
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    ctx.fillStyle="white";
    ctx.fill();
  };

  updateCanvas = () => {
    const {
      x1,
      x2,
      y1,
      y2,
    } = this.state;

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    this.clearCanvas(ctx);

    this.drawTowns();
    this.calculateDistancesToTowns(ctx); // ctx here for debugging only
    this.drawLine(ctx, x1, y1, x2, y2, 'black')
  };

  calculateDistanceTownToFlightPath = (x, y, ctx) => {
      const { x1, x2, y1, y2 } = this.state;
      const mFlightPath = (y2 - y1) / (x2 - x1);
      const bFlightPath = y1 - mFlightPath * x1;

      const mTownToFlightPath = -1 / mFlightPath;
      const bTownToFlightPath = y - mTownToFlightPath * x;

      const xIntercept = (bTownToFlightPath - bFlightPath) / (mFlightPath - mTownToFlightPath);
      const yIntercept = mTownToFlightPath * xIntercept + bTownToFlightPath;

      const townToFlightPathDistance = Math.sqrt((x - xIntercept)**2 + (y - yIntercept)**2);

      const flightStartToInterceptDistance = Math.sqrt((x1 - xIntercept)**2 + (y1 - yIntercept)**2);

      const distance = flightStartToInterceptDistance + townToFlightPathDistance;

      this.drawLine(ctx, xIntercept, yIntercept, x, y, 'red');

      return distance;
  }

  calculateDistancesToTowns = (ctx) => {
      TOWNS.map((t)=> {
        t.distance = this.calculateDistanceTownToFlightPath(t.x, t.y, ctx);
      });
      console.log(TOWNS);
  };

  render() {


    return(
      <div>
        <canvas ref="canvas" width={CANVAS.WIDTH} height={CANVAS.HEIGHT} />
      </div>
    )
  }
}