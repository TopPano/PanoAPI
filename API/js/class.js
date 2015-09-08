/**
 * Toppano Panorama Viewer API
 * Class
 */

// LatLng
TOPPANO.LatLng = function(lat, lng) {
	this.lat = lat;
	this.lng = lng;
};

TOPPANO.LatLng.prototype = {
	constructor: TOPPANO.LatLng,

	lat: function() {
		return this.lat;
	},

	lng: function() {
		return this.lng;
	},

	// toString: function() {
	// 	return 
	// },

	toUrlValue: function() {
		return this.lat.toString() + "," + this.lng.toString();
	}
};

