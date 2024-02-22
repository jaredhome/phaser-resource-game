import resourceIndex from '../data/resourceIndex.js' // Import the resource index

export class GridManager {
	constructor(scene, gridWidth, gridHeight, cellTypes, gridCellSize) {
		this.scene = scene
		this.gridWidth = gridWidth
		this.gridHeight = gridHeight
		this.cellTypes = cellTypes
		this.gridCellSize = gridCellSize
		this.grid = []
		this.highlight = null
	}

	initializeGrid() {
		for (let y = 0; y < this.gridHeight; y++) {
			let row = []
			for (let x = 0; x < this.gridWidth; x++) {
				// Generates a cell, the type based on the y value (elevation)
				// TODO: Replace this with a more sophisticated world generation algorithm
				let seed = y < 16 ? 'empty' : y === 16 ? 'grass' : y === 17 ? 'dirt' : 'stone'
				row.push(new GridCell(resourceIndex[seed]))
			}
			// Push finished row to the grid
			this.grid.push(row)
		}
	}

	// Draw the grid based on the cell types
	drawGrid() {
		for (let y = 0; y < this.gridHeight; y++) {
			for (let x = 0; x < this.gridWidth; x++) {
				let cell = this.grid[y][x]
				let color = this.cellTypes[cell.type]
				// Create a graphics object for each cell
				cell.graphics = this.scene.add.graphics({ fillStyle: { color: color, alpha: 1 } })
				// Draw the cell
				cell.graphics.fillRect(x * this.gridCellSize, y * this.gridCellSize, this.gridCellSize, this.gridCellSize)
			}
		}
	}

	// Iterate through the grid and create colliders for cells with collision
	setCollision(physicalGroup) {
		// 'physicalGroup' is a Phaser physics group – such as the static group 'environmentColliders' we created in Game.js
		for (let y = 0; y < this.gridHeight; y++) {
			for (let x = 0; x < this.gridWidth; x++) {
				let cell = this.grid[y][x]
				cell.refresh(x, y, this.gridCellSize, physicalGroup)
			}
		}
	}

	// Highlight the cell under the cursor
	// TODO: Add a transparent highlight sprite to the cell instead of drawing a rectangle
	highlightCell(x, y) {
		if (!this.highlight) {
			this.highlight = this.scene.add.graphics({ fillStyle: { color: 0x76baff, alpha: 0.5 } })
		}
		this.highlight.clear()
		this.highlight.fillRect(x * this.gridCellSize, y * this.gridCellSize, this.gridCellSize, this.gridCellSize)
	}

	selectCell(x, y, playerX, playerY, interactionRange) {
		// Calculate the player's grid position
		let playerGridX = Math.floor(playerX / this.gridCellSize);
		let playerGridY = Math.floor(playerY / this.gridCellSize);

		// Calculate the distance between the player and the selected cell
		let distanceX = Math.abs(x - playerGridX);
		let distanceY = Math.abs(y - playerGridY);

		/* INTERACT WITH CELL IF WITHIN RANGE  * * * * * * * * * * * * * * * * * * * * * * */
		if (distanceX <= interactionRange && distanceY <= interactionRange) {
			let cell = this.grid[y][x]
			/* INTERACT EXAMPLE – REMOVE CELL  * * * * * * * * * * * * * * * * * * * * * * */
			if (cell.type !== 'empty') {
				// Update the cell type to 'empty' - effectively removing it
				cell.updateProperties(resourceIndex['empty'], x, y, this.gridCellSize, this.scene.environmentColliders)
				// Additional game logic here (e.g., updating score, playing a sound, etc.)
			}
		}
	}
}

class GridCell {
	constructor(resourceId) {
		this.initializeProperties(resourceId)
		this.physicalGroup = null
		this.collider = null
		this.graphics = null
	}

	initializeProperties(resourceId) {
		this.type = resourceId.type
		this.durability = resourceId.durability
		this.hasCollision = resourceId.hasCollision
	}

	updateProperties(resourceId, x, y, gridCellSize, physicalGroup) {
		// TODO: CHANGE TO SET TYPE
		// Update cell properties with new values
		this.type = resourceId.type
		this.durability = resourceId.durability
		this.hasCollision = resourceId.hasCollision

		// Update the physical group
		this.physicalGroup = physicalGroup

		// Refresh the cell to update its appearance and collider
		this.refresh(x, y, gridCellSize, this.physicalGroup)
	}

	// Creates a collider for the cell if it has collision
	createCollider(x, y, gridCellSize, physicalGroup) {
		this.collider = physicalGroup.create(x * gridCellSize + gridCellSize / 2, y * gridCellSize + gridCellSize / 2, null)
		this.collider.setSize(gridCellSize, gridCellSize)
		this.collider.setVisible(false)
		this.collider.setImmovable(true)
	}

	// Removes the collider if it exists
	removeCollider() {
		if (this.collider) {
			this.collider.destroy()
			this.collider = null
		}
	}

	// Refreshes the cell's appearance and collider
	refresh(x, y, gridCellSize, physicalGroup) {
		/* UPDATE COLLIDER OBJECT * * * * * * * * * * * * * * * * * * * * * * */
		if (this.hasCollision) {
			if (!this.collider) {
				this.createCollider(x, y, gridCellSize, physicalGroup)
			}
		} else {
			this.removeCollider()
		}

		/* UPDATE GRAPHICS OBJECT * * * * * * * * * * * * * * * * * * * * * * */
		if (this.graphics) {
			this.graphics.clear(); // Clear the existing graphics object
			let color = resourceIndex[this.type].color; // Get the color from the resource index
			this.graphics.fillStyle(color, 1); // Set the fill style

			// Redraw the cell
			this.graphics.fillRect(this.x * this.gridCellSize, this.y * this.gridCellSize, this.gridCellSize, this.gridCellSize);
		}
	}
}

