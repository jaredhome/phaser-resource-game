const resourceIndex = {
	empty: {
		type: 'empty',
		color: '#ADD8E6', // 'Light Blue
		durability: 0,
		hasCollision: false,
	},
	grass: {
		type: 'grass',
		color: '#00FF00', // Green
		durability: 2,
		hasCollision: true,
	},
	stone: {
		type: 'stone',
		color: '#808080', // Gray
		durability: 5,
		hasCollision: true,
	},
	dirt: {
		type: 'dirt',
		color: '#8B4513', // Brown
		durability: 3,
		hasCollision: true,
	},
	wood: {
		type: 'wood',
		color: '#A52A2A', // Reddish-Brown
		durability: 4,
		hasCollision: true,
	},
}

export default resourceIndex
