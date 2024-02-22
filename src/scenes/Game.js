import { Scene } from 'phaser'

export class Game extends Scene {
    constructor() {
        super('Game')
        this.player = null
        this.interactionRange = 3
        this.cursors = null
        this.platforms = null
        // Initialize the grid manager
        this.gridManager = null

    }

    preload() {
        this.load.image('player', 'assets/player.png')
        this.load.image('empty', 'assets/empty.png')
        this.load.spritesheet('player-left', 'assets/player-left.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('player-right', 'assets/player-right.png', { frameWidth: 32, frameHeight: 32 })
    }

    create() {
        let cellTypes = {
            empty: 0xADD8E6, // Light Blue
            grass: 0x00FF00, // Green
            stone: 0x808080, // Gray
            dirt: 0x8B4513, // Brown
            wood: 0xA52A2A // Reddish-Brown
        }
        // Initialize and draw the GRID MANAGER
        this.gridManager = new GridManager(40, 30, cellTypes, 20)
        this.gridManager.initializeGrid()
        this.gridManager.drawGrid()

        // Create cursor keys for player input
        this.cursors = this.input.keyboard.createCursorKeys()

        // Initialize the player
        this.player = this.initializePlayer()

        // Add event listeners for mouse movement and clicks, passing player position to gridSystem
        this.input.on('pointermove', (pointer) => {
            // Convert the pointer's screen position to the world position
            let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            // Calculate the grid cell coordinates based on the pointer position
            let x = Math.floor(worldPoint.x / this.gridManager.gridCellSize)
            let y = Math.floor(worldPoint.y / this.gridManager.gridCellSize)
            // Highlight the cell under the pointer
            this.gridManager.highlightCell(x, y)
        })

        this.input.on('pointerdown', (pointer) => {
            // Convert the pointer's screen position to the world position
            let worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            // Calculate the grid cell coordinates based on the pointer position
            let x = Math.floor(worldPoint.x / this.gridManager.gridCellSize)
            let y = Math.floor(worldPoint.y / this.gridManager.gridCellSize)
            // Select the cell under the pointer
            this.GridManager.selectCell(x, y, this.player.x, this.player.y, this.interactionRange)
        })

        // Create platforms in the game
        this.createPlatforms()

        // Add a physics collider between the player and the platforms
        this.physics.add.collider(this.player, this.platforms)
    }

    update() {
        // Player movement logic...
        if (this.cursors.left.isDown || this.input.keyboard.addKey('A').isDown) {
            this.player.setVelocityX(-160)
            this.player.anims.play('left', true)
        } else if (this.cursors.right.isDown || this.input.keyboard.addKey('D').isDown) {
            this.player.setVelocityX(160)
            this.player.anims.play('right', true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.stop()
        }
    }

    initializePlayer() {
        // Create the player sprite at the specified coordinates and with the 'player' image
        let player = this.physics.add.sprite(100, 20, 'player');

        // Set the bounce factor for the player
        player.setBounce(0);

        // Make the player collide with the world bounds
        player.setCollideWorldBounds(true);

        // Set the camera to follow the player
        this.cameras.main.startFollow(player);

        // Set camera zoom
        this.cameras.main.setZoom(2);

        // Set the player depth to ensure it is rendered above the grid
        player.setDepth(10);

        // Create the player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player-left', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player-right', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        return player;
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

}
