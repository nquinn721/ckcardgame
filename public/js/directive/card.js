app.directive('card', function () {
	return {
		restrict: 'E',
		templateUrl: 'card.html',
		replace: true,
		scope: {
			card: '=',
			total: '='
		}
	}
})