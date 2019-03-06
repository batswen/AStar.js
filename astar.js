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

		const findNeighbor = (array, node) => {
			for (var i = 0; i < array.length; i++) {
				if (array[i].x == node.x && array[i].y == node.y) {
					return true
				}
			}
			return false
		}
		
		const addNeighborsToOpenList = () => {
			for (var x = -1; x <= 1; x++) {
				for (var y = -1; y <= 1; y++) {
					node = { parent_node: this.now, x: this.now.x + x, y: this.now.y + y, g: this.now.g, h: this.distance() }
					if (!this.diag && x && y) {
						continue
					}
					if ((x !== 0 || y !== 0)
						&& this.now.x + x >= 0 && this.now.x + x < this.maze[0].length
						&& this.now.y + y >= 0 && this.now.y + y < this.maze.length
						&& this.maze[this.now.y + y][this.now.x + x] !== -1
						&& !findNeighbor(open_list, node) && !findNeighbor(closed_list, node)) {
						node.g = node.parent_node.g + 10
						if (x && y && this.diag) {
							node.g = node.parent_node.g + 14
						}
						open_list.push(node)
					}
				}
			}
			open_list.sort((a, b) => { (a.g + a.h) - (b.g + b.h) }) // lowest cost first
		}
		
		addNeighborsToOpenList()
		
		// search
		while (this.now.x !== this.end[0] || this.now.y !== this.end[1]) {
			if (!open_list.length) { // nothing to examine
				this.path = []
				console.log("No path!")
				return
			}
			this.now = open_list.shift() // get first entry from open_list
			closed_list.push(this.now)
			addNeighborsToOpenList()
		}
		this.path.unshift(this.now) // start with the last node
		
		// add all the nodes to path
		while (this.now.x !== this.start[0] || this.now.y !== this.start[1]) {
			this.now = this.now.parent_node
			this.path.unshift(this.now)
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

const as = new Astar(maze, [0, 0], [6, 7])
as.findPath()
var path = as.getPath()
for (let i = 0; i < path.length; i++) {
	console.log("X: " + path[i].x + ", Y: " + path[i].y)
}
