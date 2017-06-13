
app.factory('Player', function (Card, $timeout) {
    function Player(data) {
        this.id = data.id;
        this.name = data.name;
        this.hp = data.hp;
        this.cards = [];
        this.creature = {};
        this.defense = {};
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

        update: function(userObj) {
            this.totalAttack = 0;
            this.totalDefense = 0;
            // this.hasPlayedCards = false;           
            

            var self = this;
            if(userObj.hp < this.hp)
                this.showDamage = this.hp - userObj.hp;
            for(var i in userObj)
                this[i] = userObj[i];

            for(var i in this.playedCards){
                this.totalAttack += this.playedCards[i].map(function(v){return v.att || 0}).reduce(function(a,b){return a + b});
                this.totalDefense += this.playedCards[i].map(function(v){return v.def || 0}).reduce(function(a,b){return a + b});
                // this.hasPlayedCards = true;
            }

            $timeout(function() {
                self.showDamage = false;
            }, 3000)
        }
    };

    return Player;
});