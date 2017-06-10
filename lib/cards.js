var resourceAmount = 3;
var resourceTypes = ['water', 'meat', 'brick']
var cards = [
    {
        name: 'Pterodactyl',
        type: 'creature',
        resourcesNeeded: {
            meat: 2,
            water: 1
        },
        att: 10,
        def: 3
    },
    {
        name: 'T-Rex',
        resourcesNeeded: {
            meat: 5,
            water: 3
        },
        att: 25,
        def: 5
    },
    {
      name: 'Raptor',
        resourcesNeeded: {
            meat: 3,
            water: 5
        },
        att: 15,
        def: 7
    },
    {
        name: 'Fence',
        resourcesNeeded: {
            brick: 2
        },
        def: 5
    },
    {
        name: 'Wall',
        resourcesNeeded: {
            brick: 3
        },
        def: 10
    },
    {
        name: 'Fortress',
        resourcesNeeded: {
            brick: 8
        },
        def: 15
    }
];

for(var i = 0; i < resourceAmount; i++)
    for(var j = 0; j < resourceTypes.length; j++)
        cards.push({type: 'resource', name: resourceTypes[j]})


module.exports = cards;