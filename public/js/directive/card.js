app.directive('card', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/card.html',
		replace: true,
		scope: {
			card: '=',
			total: '=',
			trade: '=',
			g: '='
		}
	}
})