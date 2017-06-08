app.config(function ($routeProvider) {
   $routeProvider
       .when('/', {
           templateUrl: 'login.html',
           controller: 'login',
           controllerAs: 'l'
       })
       .when('/game/:user', {
           templateUrl: 'game.html',
           controller: 'game',
           controllerAs: 'g'
       })
});