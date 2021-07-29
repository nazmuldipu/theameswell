"use-strict";

/**
 * Google Maps Script
 * @param {HTMLElement} element 
 * @param {Object[]} locations 
 * @param {Object} options 
 */
export const googleMaps = ( element, locations, options={} ) => {
	/** Creation of script tag */
	const script = document.createElement("script");
	const src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_API_KEY;
	script.src = src;
	script.defer = true;
	document.body.append(script);

	/**
	 * Google maps marker generator
	 * 
	 * @param {LatLng} position 
	 * @param {Map} map 
	 * @param {String} title 
	 * @param {InfoWindow} infowindow 
	 * @returns Marker
	 */
	function generateMarker( map, position, title, infowindow ) {
		const { markerOptions } = options;
		const { fillColor, strokeColor } = markerOptions ? markerOptions: { fillColor: "#ea4335", strokeColor: "#b31412" };

		const icon = {
			path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
			anchor: new google.maps.Point(12,17),
			fillOpacity: 1,
			strokeWeight: 2,
			fillColor: fillColor,
			strokeColor: strokeColor,
			scale: 2
		};

		let marker = new google.maps.Marker({
			position,
			title,
			icon,
			map,
		});

		// Show Name on click event
		google.maps.event.addListener(marker, 'click', (function(marker) {
			return () => {
				infowindow.setContent(`<h3 class="text-sm py-1 px-4 m-0">${title}</h3>`);
				infowindow.open(map, marker);
			}
		})(marker));

		return marker;
	}

	function init() {
		const { Map, LatLng, InfoWindow, MapTypeId } = google.maps;

		let infowindow	= new InfoWindow(),
			map			= new Map(element, {
				zoom: options.zoom || 14,
				center: new LatLng(
					locations[0].lat,
					locations[0].long
				),
				mapTypeId: MapTypeId.ROADMAP
			});

		// Generate Markers
		if( ! options.disableMarker ) {
			locations.forEach(marker => generateMarker(
				map,
				new LatLng( marker.lat, marker.long ),
				marker.title,
				infowindow,
			));
		}
	}

	/**
	 * Timeout function to initialize script once api script loads.
	 * TODO: Attaching init function with script callback - Malik, 30th June 2021
	 */
	setTimeout(() => {
		init();
	}, 1000);
}