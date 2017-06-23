var card = [
    /**
     * RESOURCES
     */
    {
        type: 'resource',
        name: 'Water',
        id: 'water',
        drawChance: 4,
        total: 1
    }, 
    {
        type: 'resource',
        name: 'Meat', 
        id: 'meat',
        drawChance: 4,
        total: 1
    },
    {
        type: 'resource',
        name: 'Brick', 
        id: 'brick',
        drawChance: 4,
        total: 1
    },
    {
        type: 'resource',
        name: 'Leaf',
        id: 'leaf',
        drawChance: 4,
        total: 1
    },
    {
        type: 'resource',
        name: 'Water x2', 
        id: 'water',
        drawChance: 2,
        total: 2
    },
    {
        type: 'resource',
        name: 'Water x5', 
        id: 'water',
        drawChance: 1,
        total: 5
    },
    {
        type: 'resource',
        name: 'Meat x2', 
        id: 'meat',
        drawChance: 2,
        total: 2
    },
    {
        type: 'resource',
        name: 'Meat x5', 
        id: 'meat',
        drawChance: 1,
        total: 5
    },
    {
        type: 'resource',
        name: 'Brick x2',
        id: 'brick',
        drawChance: 2,
        total: 2
    },
    {
        type: 'resource',
        name: 'Brick x5',
        id: 'brick',
        drawChance: 1,
        total: 5
    },
    {
        type: 'resource',
        name: 'Leaf x2',
        id: 'leaf',
        drawChance: 2,
        total: 2
    },
    {
        type: 'resource',
        name: 'Leaf x5',
        id: 'leaf',
        drawChance: 1,
        total: 5
    },
    /**
     * END RESOURCES
     */

     /**
      * CREATURES
      */

    {
        name: 'Pterodactyl',
        type: 'creature',
        id: 'pterodactyl',
        resourcesNeeded: {
            meat: 2,
            water: 1
        },
        drawChance: 3,
        att: 10,
        def: 3
    },
    {
        name: 'T-Rex',
        id:  'trex',
        type: 'creature',
        resourcesNeeded: {
            meat: 5,
            water: 3
        },
        drawChance: 1,
        att: 25,
        def: 5
    },
    {
        name: 'Raptor',
        type: 'creature',
        id:  'raptor',
        resourcesNeeded: {
            meat: 3,
            water: 5
        },
        drawChance: 2,
        att: 15,
        def: 7
    },
    {
        name: 'Brontosourus',
        type: 'creature',
        id: 'brotnosourus',
        resourcesNeeded: {
            leaf: 4,
            water: 2
        },
        drawChance: 2,
        att: 5,
        def: 10
    },
    {
        name: 'Triceratops',
        type: 'creature',
        id: 'triceratops',
        resourcesNeeded: {
            leaf: 3,
            water: 5
        },
        drawChance: 2,
        att: 8,
        def: 8
    },
    /**
     * END CREATURES
     */

     /**
      * DEFENSE
      */

    {
        name: 'Fence',
        type: 'defense',
        id:  'fence',
        resourcesNeeded: {
            brick: 2
        },
        drawChance: 3,
        def: 5
    },
    {
        name: 'Wall',
        type: 'defense',
        id:  'wall',
        resourcesNeeded: {
            brick: 3
        },
        drawChance: 2,
        def: 10
    },
    {
        name: 'Fortress',
        type: 'defense',
        id:  'fortress',
        resourcesNeeded: {
            brick: 8
        },
        drawChance: 1,
        def: 15
    }
    /**
     * DEFENSE
     */
];


var cards = [];

for(var j = 0; j < card.length; j++)
    for(var i = 0; i < card[i].drawChance; i++)
        cards.push(card[j]);


module.exports = cards;