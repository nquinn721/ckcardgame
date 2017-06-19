
app.factory('Player', function (Card, $timeout) {
    function Player(data) {
        this.id = data.id;
        this.name = data.name;
        this.hp = data.hp;
        this.cards = [];
        this.creature = {};
        this.defense = {};
        this.showPlayedCards = {};
        this.brick = 0;
        this.meat = 0;
        this.water = 0;

        this.totalAttack = 0;
        this.totalDefense = 0;

    }

    Player.prototype = {
        showCantPlayCard: function () {
            var self = this;
            this.cantPlayCard = true;
            $timeout(function(){
                self.cantPlayCard = false;
            }, 2000);

        },
        
        drawCard: function (card, dontshowcard) {
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
                }
            }.bind(this), dontshowcard ? 10 : 800);

        },
        updatePlayedCards: function() {
            this.showPlayedCards = {};
            var card;
            for(var i = 0; i < this.playedCards.length; i++){
                card = this.playedCards[i];
                if(!this.showPlayedCards[card.id])this.showPlayedCards[card.id] = [];
                this.showPlayedCards[card.id].push(card);
            }
            
        },

        update: function(userObj) {
            this.totalAttack = 0;
            this.totalDefense = 0;


            var self = this;
            if(userObj.hp < this.hp)
                this.showDamage = this.hp - userObj.hp;
            for(var i in userObj)
                this[i] = userObj[i];

            for(var i = 0; i < this.playedCards.length; i++){
                this.totalAttack    += this.playedCards[i].att || 0;
                this.totalDefense   += this.playedCards[i].def || 0;
                this.updatePlayedCards();
            }

            $timeout(function() {
                self.showDamage = false;
            }, 3000)
        }
    };

    return Player;
});