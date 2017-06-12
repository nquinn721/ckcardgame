app.directive('player', function() {
	return {
		restrict: 'E',
		templateUrl: 'player.html',
		replace: true,
		scope: {
			player: '=',
		}
	}
});