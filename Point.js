class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  colides (x, y) {
    if (Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2)) <= this.radius) {
      return true;
    } else {
      return false;
    }
  }
  
  movePoint (x, y) {
    this.x = x;
    this.y = y;
  }
}