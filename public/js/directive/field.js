app.directive('field', function() {
	return {
		restrict: 'E',
		templateUrl: 'partials/field.html',
		replace: true,
		scope: {
			g: '='
		}
	}
});