function Card(card) {
    for(var i in card)
        this[i] = card[i];
}

Card.prototype = {

};

module.exports = Card;