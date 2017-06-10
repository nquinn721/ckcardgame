app.directive('card-tag', function () {
	return {
		restrict: 'E',
		templateUrl: 'card.html',
		replace: true,
		controller: 'game',
		controllerAs: 'g',
		scope: {
			card: '='
		},
		// link: function($scope, $el, $attrs) {
			
		// }
	}
})