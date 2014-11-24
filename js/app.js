// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {

    function createMap(center, zoom) {
        var mapElem = document.getElementById('map');

        var map = new google.maps.Map(mapElem, {
            center: center,
            zoom: zoom
        });

        var infoWindow = new google.maps.InfoWindow();

        $(window).resize(function() {
            $('#map').css('height', $(window).height() - $('#map').position().top - 20);
        });

        var markerImage = 'img/camera_icon.png';

        $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
            .done(function(data) {
                data.forEach(function(locations) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: Number(locations.location.latitude),
                            lng: Number(locations.location.longitude)
                        },

                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon: markerImage
                    });

                    google.maps.event.addListener(map, 'click', function() {
                        infoWindow.close();
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        var html = '<p>' + locations.cameralabel +'</p>';
                        html += '<img src=\'' + locations.imageurl.url + '\'/>';
                        infoWindow.setContent(html);
                        infoWindow.open(map, this);
                        map.panTo(this.getPosition());
                    });

                    $('#search').bind('search keyup', function() {
                        var value = this.value.toLowerCase();
                        var label = locations.cameralabel.toLowerCase();
                        if (label.indexOf(value) == -1) {
                            marker.setMap(null);
                        }
                        else {
                            marker.setMap(map);
                        }
                    });
                });

            }).fail(function(err) {
                alert(err);
            });
    }

    var seattleCoords = {
        lat: 47.6,
        lng: -122.3
    };

    createMap(seattleCoords, 12);
});