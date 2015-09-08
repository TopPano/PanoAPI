/**
 * Toppano Panorama Viewer API
 * Class
 */

// LatLng
TOPPANO.LatLng = function(latitude, longitude) {
	this._lat = latitude;
	this._lng = longitude;
};

TOPPANO.LatLng.prototype = {
	constructor: TOPPANO.LatLng,

	equals: function(lat2, lng2) {
		var epsilon = 0.1;
		if ( Math.abs(this._lat - lat2) + Math.abs(this._lng - lng2) < epsilon )
			return true;
		return false;
	},

	lat: function() {
		return this._lat;
	},

	lng: function() {
		return this._lng;
	},

	toString: function() {
		return "lat: " + this._lat.toString() + ", lng: " + this._lng.toString();
	},

	toUrlValue: function() {
		return this._lat.toString() + "," + this._lng.toString();
	}
};

// Size
TOPPANO.Size = function(w, h) {
	this.width = w;
	this.height = h;
};

TOPPANO.Size.prototype = {
	constructor: TOPPANO.Size,

	equals: function(w2, h2) {
		var epsilon = 0.1;
		if ( Math.abs(this.width - w2) + Math.abs(this.height - h2) < epsilon )
			return true;
		return false;
	},

	toString: function() {
		return "width: " + this.width.toString() + ", height: " + this.height.toString();
	}
};



