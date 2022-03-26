function Tile(x,y) {
    this.x = x;
    this.y = y;
    this.type = 0;
    this.gCost = 0;
    this.hCost = null;
    this.parent = null;

    this.fCost = function() {
        return this.hCost + this.gCost
    }

}