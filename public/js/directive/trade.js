app.directive('trade', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/trade.html',
		controller: 'trade',
		controllerAs: 'trade',
		bindToController: true
	}
})