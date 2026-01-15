// Data
const data = {
  screen: {
    width: 640,
    height: 480,
    halfWidth: null,
    halfHeight: null
  },
  render: {
    delay: 30, //milliseconds
  },
  rayCasting: {
    incrementAngle: null,
    precision: 64
  },
  player: {
    fov: 60,
    halfFov: null,
    x: 2,
    y: 2,
    angle: 90
  },
  map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]
}

// Calculated data
data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.screen.width;
data.player.halfFov = data.player.fov / 2;

// Canvas
const screen = document.createElement("canvas");
screen.width = data.screen.width;
screen.height = data.screen.height;
screen.style.border = "1px solid black";
document.body.appendChild(screen);
const screenContext = screen.getContext("2d");
