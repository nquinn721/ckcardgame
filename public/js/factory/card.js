
app.factory('Card', function () {
    function Card(card) {
        for(var i in card)
            this[i] = card[i];
    }

    Card.prototype = {

    };

    return Card;
});
