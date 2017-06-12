app.directive('player', function() {
	return {
		restrict: 'E',
		templateUrl: 'player.html',
		controller: 'game',
		controllerAs: 'g',
		bindToController: true,
		replace: true
	}
});