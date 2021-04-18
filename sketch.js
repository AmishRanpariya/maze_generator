function index(i, j) {
	if (i < 0 || i >= cols || j < 0 || j >= rows) return -1;
	return i + cols * j;
}

function removeWalls(a, b) {
	let x = a.i - b.i;
	let y = a.j - b.j;
	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if (x === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	} else if (y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}
}

class Cell {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.walls = [true, true, true, true];
		//T,R,B,Left
		this.visited = false;
	}
	show() {
		let x = this.i * w;
		let y = this.j * w;
		stroke(25);
		strokeWeight(2);
		this.walls[0] && line(x, y, x + w, y);
		this.walls[1] && line(x + w, y, x + w, y + w);
		this.walls[2] && line(x, y + w, x + w, y + w);
		this.walls[3] && line(x, y, x, y + w);

		fill(0, 0);
		this.visited && fill("#51f4d3");
		noStroke();
		rect(x, y, w, w);
	}
	highlight() {
		let x = this.i * w + 2;
		let y = this.j * w + 2;
		fill("#f164ff");
		noStroke();
		rect(x, y, w - 4, w - 4);
	}
	checkNeighbors() {
		let neighbors = [];
		let i = this.i;
		let j = this.j;

		let top = grid[index(i, j - 1)];
		let right = grid[index(i + 1, j)];
		let bottom = grid[index(i, j + 1)];
		let left = grid[index(i - 1, j)];

		top && (top.visited || neighbors.push(top));
		right && (right.visited || neighbors.push(right));
		bottom && (bottom.visited || neighbors.push(bottom));
		left && (left.visited || neighbors.push(left));

		if (neighbors.length > 0) {
			return random(neighbors);
		} else {
			return undefined;
		}
	}
}
let grid = [];
let cols = 25,
	rows = cols;
let w;
let current;

let stack = [];
let done = false;

function setup() {
	let winSize = min(windowHeight, windowWidth);
	createCanvas(min(1000, winSize), min(1000, winSize));

	w = floor(width / cols);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			grid.push(new Cell(j, i));
		}
	}

	current = grid[0];
	strokeWeight(1);
	strokeCap(SQUARE);
}

function draw() {
	background(50);
	for (let i = 0; i < grid.length; i++) {
		grid[i].show();
	}
	current.visited = true;
	current.highlight();
	if (!done) {
		let next = current.checkNeighbors();
		if (next) {
			next.visited = true;
			stack.push(current);
			removeWalls(current, next);
			current = next;
		} else {
			if (stack.length > 0) {
				current = stack.pop();
			} else {
				done = true;
				frameRate(20);
			}
		}
	} else {
		if (current.i == cols - 1 && current.j == rows - 1) {
			noLoop();
		}
		if (keyIsDown(LEFT_ARROW)) {
			let i = current.i;
			let j = current.j;
			let left = grid[index(i - 1, j)];
			left && (current.walls[3] || (current = left));
		}

		if (keyIsDown(RIGHT_ARROW)) {
			let i = current.i;
			let j = current.j;
			let right = grid[index(i + 1, j)];
			right && (current.walls[1] || (current = right));
		}

		if (keyIsDown(UP_ARROW)) {
			let i = current.i;
			let j = current.j;
			let top = grid[index(i, j - 1)];
			top && (current.walls[0] || (current = top));
		}

		if (keyIsDown(DOWN_ARROW)) {
			let i = current.i;
			let j = current.j;
			let bottom = grid[index(i, j + 1)];
			bottom && (current.walls[2] || (current = bottom));
		}
	}
}
function doubleClicked() {
	saveCanvas(canvas, `maze${rows}x${cols}`, "png");
}

function keyPressed() {
	if (keyCode == 32) {
		saveCanvas(canvas, `maze${rows}x${cols}`, "png");
	}
}
