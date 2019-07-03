"use strict"

/*
Implementation of the A* algorithm

Runs in node or any browser except IE
*/

class Astar {
	/*
	** @param array maze
	** @param array start
	** @param array end
	** @param bool diag Move diagonally? Default is true
	*/
	constructor(maze, start, end, diag = true) {
		this.maze = maze
		this.start = start
		this.now = { x: start[0], y: start[1], g: 0, h: 0 }
		this.end = end
		this.diag = diag
		this.path = []
	}
	findPath() {
		var open_list = [], closed_list = [this.now], node = {}

		// Looks in open/closed_list for a node
		const findNeighbor = (array, node) => {
			for (var i = 0; i < array.length; i++) {
				if (array[i].x == node.x && array[i].y == node.y) {
					return true
				}
			}
			return false
		}
		
		// addNeighborsToOpenList
		const addNeighborsToOpenList = () => {
			for (var x = -1; x <= 1; x++) {
				for (var y = -1; y <= 1; y++) {
					// create new node
					node = { parent_node: this.now, x: this.now.x + x, y: this.now.y + y, g: this.now.g, h: this.distance() }
					if (!this.diag && x && y) {	// is diagonal movement allowed?
						continue
					}
					if ((x !== 0 || y !== 0)	// not the node?
						&& this.now.x + x >= 0 && this.now.x + x < this.maze[0].length	// in the maze?
						&& this.now.y + y >= 0 && this.now.y + y < this.maze.length
						&& this.maze[this.now.y + y][this.now.x + x] !== -1				// is cell not blocked?
						&& !findNeighbor(open_list, node) && !findNeighbor(closed_list, node)) {	// and not already in either open_list or closed_list
						node.g = node.parent_node.g + 10	// add movement cost of 10 per step (horizontal/vertical)
						if (x && y && this.diag) {
							node.g += 4 // diagonal cost is 14 (sqrt(dx²+dy²))
						}
						open_list.push(node)	// add to open_list
					}
				}
			}
			open_list.sort((a, b) => { (a.g + a.h) - (b.g + b.h) }) // lowest cost first
		}
		
		// init open_list with all nodes around the start node
		addNeighborsToOpenList()
		
		// search path
		while (this.now.x !== this.end[0] || this.now.y !== this.end[1]) { // are we there yet?
			if (!open_list.length) { // nothing to examine
				return
			}
			this.now = open_list.shift() // get first entry from open_list
			closed_list.push(this.now)	// add to closed
			addNeighborsToOpenList()	// and look at its neighbors
		}
		this.path.unshift(this.now) // start with the last node
		
		// add all the nodes to path
		while (this.now.x !== this.start[0] || this.now.y !== this.start[1]) {
			this.now = this.now.parent_node	// get previous node
			this.path.unshift(this.now)		// and add it as new first node in path
		}
	}
	distance() {
		if (this.diag) {																	// if diagonal movement
			return Math.hypot(this.now.x - this.end[0], this.now.y - this.end[1])			// return Hypothenuse
		} else {																			// if not
			return Math.abs(this.now.x - this.end[0]) + Math.abs(this.now.y - this.end[1])	// return "Manhattan distance"
		}
	}
	/*
	** @return array
	*/
	getPath() {
		return this.path
	}
}


// Example maze (0 = space, -1 = blocked)
const maze = [
	[ 0,  0,  0,  0,  0,  0,  0],
	[-1, -1, -1, -1, -1, -1,  0],
	[ 0,  0,  0,  0,  0, -1,  0],
	[ 0,  0,  0,  0,  0, -1,  0],
	[ 0, -1,  0, -1, -1, -1,  0],
	[ 0, -1,  0,  0,  0,  0,  0],
	[ 0, -1, -1, -1, -1, -1, -1],
	[ 0,  0,  0,  0,  0,  0,  0]
]

// Move from [0, 0] to [6, 7]
const as = new Astar(maze, [0, 0], [6, 7])
as.findPath()
var path = as.getPath()
if (path.length) {
	// a path was found
	for (let i = 0; i < path.length; i++) {
		console.log("X: " + path[i].x + ", Y: " + path[i].y)
	}
} else {
	// no path found
	console.log("No path found")
}
