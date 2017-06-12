app.directive('opponent', function() {
	return {
		restrict: 'E',
		templateUrl: 'opponent.html',
		controller: 'game',
		controllerAs: 'g',
		replace: true,
		bindToController: true
	}
});