"use strict";


let date = '2019-10-07';
let NeOs = [];
class NeO {
  constructor(missDist, size){
    this.side = 0;
    this.x = missDist;
    this.size = size;
    this.y = window.innerHeight / 2;
  }
  render(ctx, obj){
    ctx.beginPath();
    ctx.moveTo(this.x + this.size * Math.cos(0), this.y + this.size * Math.sin(0));

    for (this.side; this.side < 7; this.side++) {
      ctx.lineTo(this.x + this.size * Math.cos(this.side * 2 * Math.PI / 6), this.y + this.size * Math.sin(this.side * 2 * Math.PI / 6));
    }

    ctx.fillStyle = "#333333";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText(obj.name, this.x, this.y);
  }
}

function rationalize(miles) {
  return (miles/2) / 10;
}

window.onload = function () {
  this.document.getElementById("date").innerHTML = `Near Earth Objects on ${date}`;
  fetchNeOs();
  
}

const fetchNeOs = () => {
  fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=dQWMhJwpyRr5fc4lfAbyLKdOa6SkhwSzYmUndUst`)
  .then(NeOsData => NeOsData.json())
  .then(NeOsJSON => {
    NeOs = NeOsJSON.near_earth_objects[date];
    console.log(NeOs);
  })
  .then(renderSystem)
}

const renderSystem = () => {
  var c = document.getElementById("NeOsCanvas");
  c.height = window.innerHeight;
  c.width = window.innerWidth;
  var ctx = c.getContext("2d");
  let earth = new Image();
  earth.src = `img/earth.png`;
  var diameter = rationalize(7917.5);
  var centerX = c.width - diameter / 4;
  var centerY = c.height / 2 - diameter / 2;

  NeOs.map((NEO) => {
    let CAD = parseFloat(NEO.close_approach_data[0].miss_distance.miles);
    let diameter = NEO.estimated_diameter.miles.estimated_diameter_max;
    console.log(`CAD: ${CAD/1000}, Diameter: ${diameter*1000000}`);
    let object = new NeO(CAD/50000, diameter*100);
    object.render(ctx, NEO);
  })
  
  earth.onload = function(){
    ctx.drawImage(earth, centerX, centerY, diameter, diameter);
  }
}