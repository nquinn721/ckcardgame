
app.factory('Player', function (Card, $timeout) {
    function Player(game, data) {
        this.game = game;
        this.id = data.id;
        this.name = data.name;
        this.hp = data.hp;
        this.cards = [];
        this.characters = {};
        this.cardsPlayed = [];
        this.brick = 0;
        this.meat = 0;
        this.water = 0;

        for(var i = 0; i < data.cards.length; i++)
            this.cards.push(new Card(data.cards[i]));
    }

    Player.prototype = {
        showCard: function(card){
            this.playedCards = card;
        },
        playCard: function (card) {
            if(this.cardPlayed)return;


            var cardCanBePlayed = true,
                self = this;

            for(var i in card.resourcesNeeded){
                if(this[i] < card.resourcesNeeded[i]){
                    cardCanBePlayed = false;
                }
            }

            if(cardCanBePlayed){
                for(var i in card.resourcesNeeded)
                    this[i] -= card.resourcesNeeded[i];

                this.cardsPlayed.push(card);
                for(var i in this.characters)
                    if(this.characters[i][0] === card)this.characters[i].pop();
            }else{
                this.cantPlayCard = true;
                $timeout(function(){
                    self.cantPlayCard = false;
                }, 2000);
            }

        },
        hit: function (damage) {
            this.hp - damage;

            if(this.hp <= 0)
                this.game.end();
        },
        drawCard: function () {
            var index = Math.floor(Math.random() * this.cards.length),
                card = this.cards[index]
                self = this;

            

            this.drawnCard = card;
            $timeout(function() {
                self.drawnCard = false;
                if(card){
                    if(card.type === 'resource'){
                        this[card.name]++;
                        this['new' + card.name] = true;

                        $timeout(function () {
                            self['new' + card.name] = false;
                        }, 2000);
                    }else{
                        if(!this.characters[card.name])
                            this.characters[card.name] = [];
                        this.characters[card.name].push(card);
                    }

                }
            }.bind(this), 800);

        }
    };

    return Player;
});