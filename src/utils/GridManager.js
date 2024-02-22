class GridManager {
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
				let cellType = y < 16 ? 'empty' : y === 16 ? 'grass' : y === 17 ? 'dirt' : 'stone'
				// Example: Adjust durability and collision based on cell type
				let hasCollision = cellType === 'stone' || cellType === 'grass'
				let durability = hasCollision ? 5 : 0
				row.push(new GridCell(cellType, durability, hasCollision))
			}
			this.grid.push(row)
		}
	}

	drawGrid() {
		for (let y = 0; y < this.gridHeight; y++) {
			for (let x = 0; x < this.gridWidth; x++) {
				let cell = this.grid[y][x]
				let color = this.cellTypes[cell.type]
				let cellGraphics = this.scene.add.graphics({ fillStyle: { color: color, alpha: 1 } })
				cellGraphics.fillRect(x * this.gridCellSize, y * this.gridCellSize, this.gridCellSize, this.gridCellSize)
			}
		}
	}

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

		if (distanceX <= interactionRange && distanceY <= interactionRange) {
			let cell = this.grid[y][x]
			// Example interaction: changing the cell type to 'empty' if it's not already
			if (cell.type !== 'empty') {
				// Update cell's properties as needed
				this.updateCell(x, y, 'empty', 0, false) // Adjust parameters as necessary
				// Additional game logic here (e.g., updating score, playing a sound, etc.)
			}
		}
	}

	updateCell(x, y, newType, newDurability, newHasCollision) {
		let cell = this.grid[y][x]
		cell.type = newType
		cell.durability = newDurability
		cell.hasCollision = newHasCollision
		// Update the visual representation of the cell
		this.drawGrid()
	}
}
