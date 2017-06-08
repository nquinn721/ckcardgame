app.controller('login', function (socket, $location) {
    var self = this;

    this.name;

    this.login = function () {
        socket.emit('login', this.name, function () {
            $location.path('/game/' + self.name);
        });
    };

});