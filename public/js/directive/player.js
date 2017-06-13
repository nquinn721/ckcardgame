app.directive('player', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/player.html',
		replace: true,
		scope: {
			player: '=',
			g: '='
		}
	}
});