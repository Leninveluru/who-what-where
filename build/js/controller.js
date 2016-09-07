var app = angular.module('who-what-where', []);

app.controller('myCtrl', function ($scope, $http, $window) {
	$scope.responseDetails = [];
	var markers            = [];
	var map;
	$scope.showListAndMap  = false;

	function getData(input) {
		$http.post('/getdata', input).then(function (resp) {
			if (resp.data instanceof Array && resp.data.length > 0) {
				var respData = resp.data;
				setMapOnAllMarkers();
				markers.length         = 0;
				$scope.responseDetails = [];
				for (var i = 0; i < respData.length; i++) {
					$scope.responseDetails.push({
						class  : i,
						address: respData[i].address,
						city   : respData[i].city,
						name   : respData[i].name,
						phone  : respData[i].phone,
						rating : respData[i].rating,
						cords  : respData[i].cords,
						url    : respData[i].url,
						image  : respData[i].photo
					});
				}

				//Load the google map function
				loadInitMapMarkers();
			} else {
				console.log('No Results found');
				alert('No Results found');
			}
		}, function (error) {
			console.error(error);
		});
	}

	//on search button functionality
	$scope.onSearchButton = function () {
		if ($scope.location.toString().trim().length > 0) {
			$scope.showListAndMap = true;
			getData({query: $scope.query, location: $scope.location});
		} else {
			alert('please enter a location');
		}
	};

	function onCityPositionUpdate(position) {
		getCurrentCityPosition(position.coords.latitude, position.coords.longitude);
	}

	function getCurrentCityPosition(latitude, longitude) {
		var latlng = new google.maps.LatLng(latitude, longitude);

		new google.maps.Geocoder().geocode(
			{'latLng': latlng},
			function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						var value = results[0].formatted_address.split(",");
						var count = value.length;
						var city  = value[count - 3];
						$scope.$apply(function () {
							$scope.location = city;
						});
					}
					else {
						console.log("address not found");
					}
				}
				else {
					console.log("Geocoder failed due to: " + status);
				}
			}
		);
	}

	navigator.geolocation.getCurrentPosition(onCityPositionUpdate,
		function () {
			$scope.location = 'Pune';
		},
		{enableHighAccuracy: true, timeout: 5000, maximumAge: 600000});

	function setMapOnAllMarkers() {
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

	$scope.onClick = function (url) {
		if (url === 'NA') {
			//no url
		} else {
			$window.open(url, '_blank');
		}
	};

	function onScrollElementToTop(number) {
		var top = $('.list-container .element-' + number).get(0).offsetTop;
		$('.list-container').animate({
			scrollTop: top
		}, 1000);
	}

	function addMarker(_marker) {
		var marker = new google.maps.Marker({
			position: _marker.position,
			map     : map
		});

		var infowindow = new google.maps.InfoWindow({
			content: _marker.title
		});

		marker.addListener('mouseover', function () {
			infowindow.open(map, marker);
		});

		marker.addListener('mouseout', function () {
			infowindow.close();
		});

		//click on marker
		marker.addListener('click', function () {
			onScrollElementToTop(_marker.number);
		});

		return marker;
	}

	//map
	function loadInitMapMarkers() {
		var locations = $scope.responseDetails;
		loadMap(locations[0].cords);
		var i;

		for (i = 0; i < locations.length; i++) {
			var cords = locations[i].cords;

			var _marker = new google.maps.Marker({
				number  : i,
				position: new google.maps.LatLng(cords.lat, cords.lon),
				title   : locations[i].name,
				map     : map
			});

			markers.push(addMarker(_marker));
		}
	}

});