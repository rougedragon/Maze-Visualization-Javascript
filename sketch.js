let grid = [];
let startX = -1;
let startY = -1;
let endX = -1;
let endY = -1;

const blockSize = 50;
let gridWidth = 20;
let gridHeight = 10;

let isSolving = false;
let openSet = [];
let closedSet = [];

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
            else if (tile.type == 2) {
                fill(0,255,0)
            }
            else if (tile.type == 3) {
                fill(255,0,0)
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

    if (!isSolving) {
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

        if (keyIsDown(DOWN_ARROW)) {
            console.log("Solving")
            isSolving = true;

            openSet = [grid[startX][startY]]
        }
    }
    else {
        if (openSet.length > 0) {
            let currentNode = openSet[0]

            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].fCost() < currentNode.fCost() || (openSet[i].fCost() == currentNode.fCost() && openSet[i].hCost < currentNode.hCost)) {
                    currentNode = openSet[i];
                }
            }

            removeNodeFromOpenSet(currentNode);
            closedSet.push(currentNode);
            currentNode.type = 3;

            if (currentNode.x == endX && currentNode.y == endY) {
                console.log("Done");
                isSolving = false;
                RetracePath();
                return;
            }

            neighbours = getNeighbours(currentNode);
            for (let a = 0; a < neighbours.length; a++) {
                let neighbour = neighbours[a];
                if (neighbour.type == 1 || isInClosedSet(neighbour)) {
                    continue;
                }

                let newMovementCostToNeighbour = currentNode.gCost + getDistance(currentNode, neighbour);
                if (newMovementCostToNeighbour < neighbour.gCost || !(openSet.includes(neighbour))) {
                    neighbour.gCost = newMovementCostToNeighbour;
                    neighbour.hCost = getDistance(neighbour, grid[endX][endY]);
                    neighbour.parent = currentNode;

                    if (!(openSet.includes(neighbour))) {
                        openSet.push(neighbour)
                        grid[neighbour.x][neighbour.y].type = 2
                    }
                }
            }

        }
    }

    draw_grid();
}

function RetracePath() {
    return;
}

function getNeighbours(node) {
    let neighbours = []
    
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            if (x == 0 && y == 0) {
                continue
            }
            
            checkX = node.x + x
            checkY = node.y + y

            if(checkX >= 0 && checkX < grid.length && checkY >= 0 && checkY < grid[0].length) {
                neighbours.push(grid[checkX][checkY])
            }
        }
    }

    return neighbours
}

function getDistance(nodeA, nodeB) {
    let dstX = abs(nodeA.x - nodeB.x)
    let dstY = abs(nodeA.y - nodeB.y)

    if (dstX > dstY) {
        return 14*dstY + 10*(dstX-dstY)
    }
    else {
        return 14*dstX + 10*(dstY-dstX)
    }
}

function removeNodeFromOpenSet(node) {
    for (let b = 0; b < openSet.length; b++) {
        if (node.x == openSet[b].x && node.y == openSet[b].y) {
            openSet.splice(b,1);
            return;
        }
    }
}

function isInClosedSet(node) {
    for (let b = 0; b < closedSet.length; b++) {
        if (node.x == closedSet[b].x && node.y == closedSet[b].y) {
            return true;
        }
    }
    return false;
}