app.directive('field', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/field.html',
		controller: 'game',
		controllerAs: 'g',
		replace: true,
		bindToController: true
	}
});