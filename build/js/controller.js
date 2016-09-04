var app = angular.module('who-what-where', []);
app.controller('myCtrl', function($scope, $http) {
	$scope.responseDetails = [];
	$http.post('/getdata', {query:"food", location:"new york"}).then(function (resp) {
		if (resp.data instanceof Array && resp.data.length > 0) {
			console.log(resp.data);
			//var respData = resp.data;
			/*for(var i=0; i<respData.length;i++){
				$scope.responseDetails.push({
					address:respData[i].address,
                    city:respData[i].city,
                    name:respData[i].name,
                    phone:respData[i].phone,
                    rating:respData[i].rating,
                    url:respData[i].url,
                    image:respData[i].photo
                    
				})
			}*/
			//console.log("$scope.data", $scope.responseDetails);

            
		} else {
			console.log('No Results found');
		}
	}, function (error) {
		console.error(error);
	});

	///$scope.data = $scope.responseDetail;
	//console.log($scope.data);

});