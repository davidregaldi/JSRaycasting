// Data
const data = {
  screen: {
    width: 800,
    height: 600,
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
    angle: 90,
    movement: 0.5,
    rotation: 5.0,
    hp: 150,
    armor: 125
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
  ],
  mapStyles: {
    borderColor: "dimgray",
    floorColor: "peru",
    skyColor: "cornflowerblue",
    wallColor: "gray"
  },
  key: {
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD"
  },
}

// Calculated data
data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.screen.width;
data.player.halfFov = data.player.fov / 2;

// Fonts
const fontStyle = document.createElement("style");
fontStyle.innerHTML = `
  @import url('https://fonts.cdnfonts.com/css/amazdoom');
  body {
    font-family: 'AmazDooM', sans-serif;
  }
`;
document.head.appendChild(fontStyle);

// Canvas
const screen = document.createElement("canvas");
screen.width = data.screen.width;
screen.height = data.screen.height;
screen.style.border = "1px solid black";
document.body.appendChild(screen);
const screenContext = screen.getContext("2d");

function degreeToRadians(degree) {
  const pi = Math.PI;
  return degree * pi / 180;
}

function drawLine(x1, y1, x2, y2, cssColor) {
  screenContext.strokeStyle = cssColor;
  screenContext.beginPath();
  screenContext.moveTo(x1, y1);
  screenContext.lineTo(x2, y2);
  screenContext.stroke();
}

function rayCasting() {
  let rayAngle = data.player.angle - data.player.halfFov;

  let previousWallHeight = 0;

  for (let rayCount = 0; rayCount < data.screen.width; rayCount++) {

    // Ray data
    let ray = {
      x: data.player.x,
      y: data.player.y
    }

    // Ray path incrementers
    let rayCos = Math.cos(degreeToRadians(rayAngle)) / data.rayCasting.precision;
    let raySin = Math.sin(degreeToRadians(rayAngle)) / data.rayCasting.precision;

    // Wall finder
    let wall = 0;
    while (wall == 0) {
      ray.x += rayCos;
      ray.y += raySin;
      wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
    }

    // Pythagoras theorem
    let distance = Math.sqrt(Math.pow(data.player.x - ray.x, 2) + Math.pow(data.player.y - ray.y, 2));

    // Wall height
    let wallHeight = Math.floor(data.screen.halfHeight / distance);

    // Simple Edge Detection (Height Difference)
    let isEdge = Math.abs(wallHeight - previousWallHeight) > 8;
    let wallColor = isEdge ? data.mapStyles.borderColor : data.mapStyles.wallColor;

    // Draw sky
    drawLine(rayCount, 0, rayCount, data.screen.halfHeight - wallHeight, data.mapStyles.skyColor);

    // Draw Walls
    drawLine(rayCount, data.screen.halfHeight - wallHeight, rayCount, data.screen.halfHeight + wallHeight, wallColor);

    // Top & Bottom Borders (Simple 1px)
    drawLine(rayCount, data.screen.halfHeight - wallHeight, rayCount, data.screen.halfHeight - wallHeight + 1, data.mapStyles.borderColor);
    drawLine(rayCount, data.screen.halfHeight + wallHeight - 1, rayCount, data.screen.halfHeight + wallHeight, data.mapStyles.borderColor);

    // Draw Floor
    drawLine(rayCount, data.screen.halfHeight + wallHeight, rayCount, data.screen.height, data.mapStyles.floorColor); // Floor

    // Store for next iteration
    previousWallHeight = wallHeight;

    // Increment
    rayAngle += data.rayCasting.incrementAngle
  }
}

function clearScreen() {
  screenContext.clearRect(0, 0, data.screen.width, data.screen.height);
}

// Input handling
document.addEventListener('keydown', (event) => {
  let keyCode = event.code;

  if (keyCode === data.key.up || keyCode === "ArrowUp") {
    let playerCos = Math.cos(degreeToRadians(data.player.angle)) * data.player.movement;
    let playerSin = Math.sin(degreeToRadians(data.player.angle)) * data.player.movement;
    let newX = data.player.x + playerCos;
    let newY = data.player.y + playerSin;

    // Collision test
    if (data.map[Math.floor(newY)][Math.floor(newX)] == 0) {
      data.player.x = newX;
      data.player.y = newY;
    }
  } else if (keyCode === data.key.down || keyCode === "ArrowDown") {
    let playerCos = Math.cos(degreeToRadians(data.player.angle)) * data.player.movement;
    let playerSin = Math.sin(degreeToRadians(data.player.angle)) * data.player.movement;
    let newX = data.player.x - playerCos;
    let newY = data.player.y - playerSin;

    // Collision test
    if (data.map[Math.floor(newY)][Math.floor(newX)] == 0) {
      data.player.x = newX;
      data.player.y = newY;
    }
  } else if (keyCode === data.key.left || keyCode === "ArrowLeft") {
    data.player.angle -= data.player.rotation;
  } else if (keyCode === data.key.right || keyCode === "ArrowRight") {
    data.player.angle += data.player.rotation;
  }
});

function drawHUD() {
  screenContext.font = "26px AmazDooM";
  screenContext.fillStyle = "lightgrey";
  screenContext.fillText("HEALTH: " + data.player.hp, 10, data.screen.height - 10);
  screenContext.fillText("ARMOR: " + data.player.armor, data.screen.width - 164, data.screen.height - 10);

  // Crosshair
  screenContext.strokeStyle = "yellow";
  screenContext.lineWidth = 3;
  screenContext.beginPath();
  screenContext.moveTo(data.screen.halfWidth - 8, data.screen.halfHeight);
  screenContext.lineTo(data.screen.halfWidth + 8, data.screen.halfHeight);
  screenContext.moveTo(data.screen.halfWidth, data.screen.halfHeight - 8);
  screenContext.lineTo(data.screen.halfWidth, data.screen.halfHeight + 8);
  screenContext.stroke();
}

// Main loop
main();

function main() {
  setInterval(function () {
    clearScreen();
    rayCasting();
    drawHUD();
  }, data.render.delay);
}
