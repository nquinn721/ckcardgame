app.directive('card', function () {
	return {
		restrict: 'E',
		templateUrl: 'card.html',
		replace: true,
		controller: 'game',
		controllerAs: 'g',
		scope: {
			card: '=',
			total: '='
		}
	}
})