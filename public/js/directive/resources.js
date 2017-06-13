app.directive('resources', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/resources.html',
		controller: 'game',
		controllerAs: 'g',
		replace: true,
		bindToController: true
	}
});