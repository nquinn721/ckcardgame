
app.factory('Player', function (Card) {
    function Player(game, data) {
        this.game = game;
        this.id = data.id;
        this.name = data.name;
        this.hp = data.hp;
        this.cards = [];
        this.drawnCards = [];
        this.brick = 0;
        this.meat = 0;
        this.water = 0;

        for(var i = 0; i < data.cards.length; i++)
            this.cards.push(new Card(data.cards[i]));
    }

    Player.prototype = {
        showCard: function(card){
            this.playedCard = card;
        },
        playCard: function (card) {
            if(this.cardPlayed)return;


            var cardCanBePlayed = true,
                self = this;

            for(var i in card.resourcesNeeded){
                if(this[i] >= card.resourcesNeeded[i]){
                    this[i] -= card.resourcesNeeded[i];
                }else{
                    cardCanBePlayed = false;
                }
            }

            if(cardCanBePlayed){
                this.playedCard = card;
                for(var i = 0; i < this.drawnCards.length; i++)
                    if(this.drawnCards[i] === card)this.drawnCards.splice(i, 1);
                return true;
            }else{
                this.cantPlayCard = true;
                setTimeout(function(){
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
                card = this.cards[index];

            if(card){
                if(card.type === 'resource'){
                    this[card.name]++;
                }else{
                    this.drawnCards.push(card);
                }

            }

        }
    };

    return Player;
});