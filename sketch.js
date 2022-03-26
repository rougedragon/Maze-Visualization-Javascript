let grid = [];
let startX = -1;
let startY = -1;
let endX = -1;
let endY = -1;

const blockSize = 50;
let gridWidth = 20;
let gridHeight = 10;

function setup() {
    createCanvas(windowWidth, windowHeight);

    gridWidth = floor(float(width)/float(blockSize));
    gridHeight = floor(float(height)/float(blockSize));

    for (let i=0; i < gridWidth; i++) {
        grid.push([])
        for (let j=0; j < gridHeight; j++) {
            grid[i].push(new Tile(i,j));
        }
    }
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw_grid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            tile = grid[i][j];

            if (tile.type == 0) {
                fill(200);
            }
            else if (tile.type == 1) {
                fill(0)
            }

            if (endX == i && endY == j) {
                fill(255,0,0)
            }
            if (startX == i && startY == j) {
                fill(0,255,0)
            }

            stroke(0);
            rect(tile.x*blockSize, tile.y*blockSize, blockSize, blockSize);
        }
    }

}

function draw() {
    background(200);

    i = floor(mouseX/blockSize);
    j = floor(mouseY/blockSize);
    if (mouseIsPressed) {
        if (!(i < 0 || i >= grid.length || j < 0 || j >= grid[0].length)) {
            // console.log(i,j,grid.length,grid[0].length);
            if (keyIsDown(UP_ARROW)) {
                grid[i][j].type = 0;
            }
            else {
                grid[i][j].type = 1;
            }

            if (startX == i && startY == j) {
                startX = -1;
                startY = -1;
            }
            if (endX == i && endY == j) {
                endX = -1;
                endY = -1;
            }
        }
    }

    if (!(i < 0 || i >= grid.length || j < 0 || j >= grid[0].length)) {
        if (keyIsDown(LEFT_ARROW)) {
            startX = i;
            startY = j;
            grid[i][j].type = 0;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            endX = i;
            endY = j;
            grid[i][j].type = 0;
        }
    }

    draw_grid();
}