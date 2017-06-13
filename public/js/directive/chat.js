app.directive('chat', function() {
	return {
		restrict: 'E',
		templateUrl: 'chat.html',
		replace: true,
		controller: 'chat',
		controllerAs: 'chat',
		bindToController: true
	}
})