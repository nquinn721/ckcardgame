
app.factory('Player', function (Card, $timeout) {
    function Player(data) {
        this.id = data.id;
        this.name = data.name;
        this.hp = data.hp;
        this.cards = [];
        this.creature = {};
        this.defense = {};
        this.playedCards = [];
        this.brick = 0;
        this.meat = 0;
        this.water = 0;

    }

    Player.prototype = {
        showCards: function(cards){
            this.playedCards = cards;
        },
        hideCards: function() {
            this.playedCards = null;
        },
        showCantPlayCard: function () {
            var self = this;
            this.cantPlayCard = true;
            $timeout(function(){
                self.cantPlayCard = false;
            }, 2000);

        },
        drawCard: function (card) {
            var self = this;
            if(!card)return;

            this.drawnCard = card;
            $timeout(function() {
                self.drawnCard = false;
                if(card){
                    if(card.type === 'resource'){
                        self[card.id] += card.total;
                        self['new' + card.id] = true;

                        $timeout(function () {
                            self['new' + card.id] = false;
                        }, 2000);
                    }else{
                        if(!self[card.type][card.id]){
                            self[card.type][card.id] = [];
                        }
                        self[card.type][card.id].push(card);
                    }
                    console.log(self.creature, self.defense);
                }
            }.bind(this),800);

        },

        update: function(userObj) {
            var self = this;
            if(userObj.hp < this.hp)
                this.showDamage = this.hp - userObj.hp;
            for(var i in userObj)
                this[i] = userObj[i];

            $timeout(function() {
                self.showDamage = false;
            }, 3000)
        }
    };

    return Player;
});