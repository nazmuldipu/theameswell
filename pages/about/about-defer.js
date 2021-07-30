import { googleMaps } from "../../scripts/googleMaps";

const locations = [ {
	title: 'The Ameswell Hotel',
	lat: 37.407411,
	long: -122.06803
} ];

/**
 * Can add markerOptions on options ( third parameter )
 * { ...options, markerOptions: { fillColor: "#05ACC1", strokeColor: "#3c87a5"  } }
 */
document.addEventListener('load', googleMaps(
	document.getElementById("map"),
	locations,
	{ zoom: 11 }
) );