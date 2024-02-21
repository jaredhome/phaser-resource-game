import { Scene } from 'phaser'

export class Game extends Scene {
    constructor() {
        super('Game')
        this.highlight = null
        this.player = null
        this.cursors = null
        this.platforms = null
        this.gridCellSize = 20
        this.grid = []
        this.gridWidth = 40
        this.gridHeight = 30
        this.cellTypes = {
            empty: 0xADD8E6, // Light Blue
            grass: 0x00FF00, // Green
            stone: 0x808080, // Gray
            dirt: 0x8B4513, // Brown
            wood: 0xA52A2A // Reddish-Brown
        }
    }

    preload() {
        this.load.image('player', 'assets/player.png')
        this.load.image('empty', 'assets/empty.png')
        this.load.spritesheet('player-left', 'assets/player-left.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('player-right', 'assets/player-right.png', { frameWidth: 32, frameHeight: 32 })
    }

    create() {
        // Initialize the game grid
        this.initializeGrid()
        // Draw the game grid
        this.drawGrid()
        // Create platforms in the game
        this.createPlatforms()

        // Create cursor keys for player input
        this.cursors = this.input.keyboard.createCursorKeys()

        // Create the player sprite at the specified coordinates and with the 'player' image
        this.player = this.physics.add.sprite(100, 20, 'player')
        // Set the bounce factor for the player
        this.player.setBounce(0.2)
        // Make the player collide with the world bounds
        this.player.setCollideWorldBounds(true)

        // Create the player animations
        this.anims.create({
            key: 'player-left',
            frames: this.anims.generateFrameNumbers('player-left', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'player-right',
            frames: this.anims.generateFrameNumbers('player-right', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        })

        // Event listener for mouse movement
        this.input.on('pointermove', (pointer) => {
            // Calculate the grid cell coordinates based on the pointer position
            let x = Math.floor(pointer.x / this.gridCellSize)
            let y = Math.floor(pointer.y / this.gridCellSize)
            // Highlight the cell under the pointer
            this.highlightCell(x, y)
        })

        // Event listener for mouse click
        this.input.on('pointerdown', (pointer) => {
            // Calculate the grid cell coordinates based on the pointer position
            let x = Math.floor(pointer.x / this.gridCellSize)
            let y = Math.floor(pointer.y / this.gridCellSize)
            // Select the cell under the pointer
            this.selectCell(x, y)
        })

        // Add a physics collider between the player and the platforms
        this.physics.add.collider(this.player, this.platforms)
    }

    update() {
        if (this.cursors.left.isDown || this.input.keyboard.addKey('A').isDown) {
            this.player.setVelocityX(-160)
            this.player.anims.play('player-left', true) // Play the left animation
        } else if (this.cursors.right.isDown || this.input.keyboard.addKey('D').isDown) {
            this.player.setVelocityX(160)
            this.player.anims.play('player-right', true) // Play the right animation
        } else {
            this.player.setVelocityX(0)
            this.player.anims.stop() // Stop the animation
        }
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup()

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x] === 'grass') {
                    let platform = this.platforms.create(x * this.gridCellSize + this.gridCellSize / 2, y * this.gridCellSize + this.gridCellSize / 2, 'empty')
                    platform.setScale(this.gridCellSize / platform.width).refreshBody()
                }
            }
        }
    }

    initializeGrid() {
        this.grid = []
        for (let y = 0; y < this.gridHeight; y++) {
            let row = []
            for (let x = 0; x < this.gridWidth; x++) {
                let cellType = y < 16 ? 'empty' : y === 16 ? 'grass' : y === 17 ? 'dirt' : 'stone'
                row.push(cellType)
            }
            this.grid.push(row)
        }
    }

    drawGrid() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                let cellType = this.grid[y][x]
                let color = this.cellTypes[cellType]
                let cellGraphics = this.add.graphics({ fillStyle: { color: color, alpha: 1 } })
                cellGraphics.fillRect(x * this.gridCellSize, y * this.gridCellSize, this.gridCellSize, this.gridCellSize)
            }
        }
    }

    highlightCell(x, y) {
        if (!this.highlight) {
            this.highlight = this.add.graphics({ fillStyle: { color: 0x76baff, alpha: 0.5 } })
        }
        this.highlight.clear()
        this.highlight.fillRect(x * this.gridCellSize, y * this.gridCellSize, this.gridCellSize, this.gridCellSize)
    }

    selectCell(x, y) {
        console.log(`Cell selected at: ${x}, ${y}, Type: ${this.grid[y][x]}`)
    }
}
