var app = angular.module('who-what-where', []);
app.controller('myCtrl', function($scope, $http, $window) {
	$scope.responseDetails = [];
	var markers = [];
	$http.post('/getdata', {query:"food", location:"new york"}).then(function (resp) {
		if (resp.data instanceof Array && resp.data.length > 0) {
			console.log(resp.data);
			var respData = resp.data;
			for(var i=0; i<25;i++){
				$scope.responseDetails.push({
					id: i,
					address: respData[i].address,
                    city: respData[i].city,
                    name: respData[i].name,
                    phone: respData[i].phone,
                    rating: respData[i].rating,
                    coords: respData[i].cords,
                    url: respData[i].url,
                    image: respData[i].photo                    
				})
			}

			loadGoogleMarkers();
			console.log('lenin', $scope.responseDetails);
		} else {
			console.log('No Results found');
		}
	}, function (error) {
		console.error(error);
	});

	//click function
	$scope.gotoBusiness = function (url) {
        console.log('item', url);
        //$window.open(url, '_blank');
    }

    //mouse hover
    $scope.onMouseOverMarker = function(event){
    	console.log('event', event)
        var id = event.currentTarget.id

        /*for(var i = 0; i < markers.length; i++){
            var marker = markers[i];
            if(marker.id === id){
                $(marker).click();
            }
        }*/
    };

	//map
	function loadGoogleMarkers(){
        var locations = $scope.responseDetails;
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: new google.maps.LatLng(-33.92, 151.25),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        var marker, i;

        for (i = 0; i < locations.length; i++) {
            var coords = locations[i].coords;
            marker = new google.maps.Marker({
                id: locations[i].name,
                position: new google.maps.LatLng(coords.lat, coords.lon),
                map: map
            });

            console.log('marker', marker)
            markers.push(marker);
            bounds.extend(marker.position);

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(locations[i].name);
                    infowindow.open(map, marker);
                    $('.grid').css('background-color', '');
                    $('#' + marker.id).css('background-color', "#ccc");

                	console.log('offset =>',  $('#' + marker.id));
                    $('.right-div').animate({
                        scrollTop: $('#' + marker.id).offset().top - 150
                    }, 2000);
                }
            })(marker, i));

            google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                return function () {
                   console.log('hover');
                }
            })(marker, i));
        }

        map.fitBounds(bounds);
    }
	

});