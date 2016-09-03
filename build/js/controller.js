var app = angular.module('who-what-where', []);
app.controller('myCtrl', function($scope, $http) {
	$http.post('/getdata', {query:"food", location:"new york"}).then(function (resp) {
		if (resp.data instanceof Array && resp.data.length > 0) {
			console.log(resp.data);
		} else {
			console.log('No Results found');
		}
	}, function (error) {
		console.error(error);
	});
});