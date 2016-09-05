var app = angular.module('who-what-where', []);

app.controller('myCtrl', function($scope, $http, $window) {
	$scope.responseDetails = [];
	var markers = [];
    function getData(input){
        $http.post('/getdata',input).then(function (resp) {
            if (resp.data instanceof Array && resp.data.length > 0) {
                var respData = resp.data;
                setMapOnAll();
                markers.length = 0;
                $scope.responseDetails = [];
				for(var i=0; i< respData.length;i++){
					$scope.responseDetails.push({
						id: (i + 1),
						address: respData[i].address,
	                    city: respData[i].city,
	                    name: respData[i].name,
	                    phone: respData[i].phone,
	                    rating: respData[i].rating,
	                    cords: respData[i].cords,
	                    url: respData[i].url,
	                    image: respData[i].photo                    
					})
				}

				loadGoogleMarkers();
            } else {
                console.log('No Results found');
            }
        }, function (error) {
            console.error(error);
        });
    }

    $scope.onSearch = function(){
        if($scope.location.toString().trim().length > 0) {
            getData({query: $scope.query, location: $scope.location});
        }else{
            alert('please enter a location');
        }
    };

	function setMapOnAll() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

	function loadMap(cords) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom  : 16,
            center: new google.maps.LatLng(cords.lat, cords.lon)
        });
    }

    //on click
    $scope.onClick = function(url){
    	if(url === 'NA'){
            //no url
        }else{
        $window.open(url, '_blank');}
    }

	//map
	function loadGoogleMarkers(){
        var locations = $scope.responseDetails;
        loadMap(locations[0].cords);
        
        var infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        var i;

        for (i = 0; i < locations.length; i++) {
            var cords = locations[i].cords;

            var marker = new google.maps.Marker({
                id: locations[i].id,
                position: new google.maps.LatLng(cords.lat, cords.lon),
                map: map
            });

            var infowindow = new google.maps.InfoWindow({
                content: locations[i].name
            });

            marker.addListener('mouseover', function () {
            	console.log("marker", locations[i].name)
                infowindow.open(map, locations[i].name);
            });

            marker.addListener('mouseout', function () {
                infowindow.close();
            });

            markers.push(marker);
        }
    }

});