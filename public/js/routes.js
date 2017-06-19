app.config(function ($routeProvider) {
   $routeProvider
       .when('/', {
           templateUrl: 'login.html',
           controller: 'login',
           controllerAs: 'l'
       })
       .when('/game', {
           templateUrl: 'game.html',
           controller: 'game',
           controllerAs: 'g'
       })
});