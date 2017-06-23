app.directive('attack', function () {
	return {
		restrict: 'E',
		templateUrl: 'partials/attack.html',
		replace: true,
		scope: {
			player: '=',
			g: '='
		}
	}
})