app.controller('login', function (socket, $location) {
    var self = this;

    this.name;

    this.login = function () {
        if(!this.name)return;
        socket.emit('login', this.name, function () {
            $location.path('/game/' + self.name);
        });
    };

});