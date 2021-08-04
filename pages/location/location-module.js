"use strict";
import "../../components/WeatherWidget/index.js";
import "../../components/MediaCarousel/index.js";
import * as data from "./location.11tydata.json";

/** Creation of script tag */
const script = document.createElement("script");
const src =
  "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_MAPS_API_KEY;
script.src = src;
script.defer = true;
document.body.append(script);
let map,
  bounds,
  markers = [];

function initMap(locations, element) {
  setTimeout(() => {
    map = new google.maps.Map(element, {
      zoom: 11,
      center: { lat: locations[0].lat, lng: locations[0].long },
    });

    addMarkers(locations);
  }, 1000);
}

const addMarkers = (locations) => {
  const { InfoWindow } = google.maps;

  const icon = {
    path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
    anchor: new google.maps.Point(12, 17),
    fillOpacity: 1,
    strokeWeight: 2,
    fillColor: "#ea4335",
    strokeColor: "#ea4335",
    scale: 2,
  };
  var infowindow = new InfoWindow();
  bounds = new google.maps.LatLngBounds();
  locations.forEach((item) => {
    let marker = new google.maps.Marker({
      position: { lat: item.lat, lng: item.long },
      map,
      title: item.title,
    });
    markers.push(marker);
    bounds.extend(marker.position);
    // Show Name on click event
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker) {
        return () => {
          infowindow.setContent(
            `<h3 class="text-sm py-1 px-4 m-0">${item.title}</h3>`
          );
          infowindow.open(map, marker);
        };
      })(marker)
    );
  });

  if (locations.length > 1) map.fitBounds(bounds);
  else if ((locations.length = 1)) {
    map.setCenter({
      lat: Number(locations[0].lat - 0.11),
      lng: locations[0].long,
    });
  }
};
const removeMarkers = () => {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
  markers = [];
};

const categories = data.categories;
const cat_map_ele = document.querySelector("#cat_map");
const sub_cat_map_ele = document.querySelector("#sub_cat_map");
const next_cat = document.querySelector("#next_cat");
const prev_cat = document.querySelector("#prev_cat");
const mob_prev = document.querySelector("#mob_prev");
const mob_next = document.querySelector("#mob_next");
let index = 0;
let subIndex = 0;
let subCatLength;
let mapLoaded = 0;
const renderTitleBox = (category) => {
  const titleText = `<div class="text-center xmed:text-left category-header">
                    <h2 class="text-2xl xmed:text-2.5xl font-medium font-serif">${
                      index === categories.length ? "Live" : category.title
                    } like a local</h2>
                    <p class="py-3">${category.body}</p>
                </div>`;
  document.querySelector("#titleBox").innerHTML = titleText;
  document.querySelector("#nav_title").innerHTML = category.title;
};

const renderSubCategories = (category) => {
  let html = "";
  category.locations.forEach((item) => {
    html += `<div class="mb-10 ">
        <div class="grid xmed:grid-cols-40-60">
            <div class="relative">
                <div class="absolute bg-ams-white text-xs w-24 p-2 top-2 right-2 text-center">${item.category_name}</div>
                <img src="${item.image}" class="w-full mb-4" alt="${item.imgalt}">
            </div>
            <div class="xmed:px-4">
                <div class="flex xmed:justify-between xmed:mb-0">
                    <div class="title justify-items-start">${item.card_title}</div>
                    <div class="justify-items-end text-ams-gold pl-3">${item.distance}</div>
                </div>
                <p>${item.card_body}</p>
            </div>
        </div>
    </div>`;
  });
  document.querySelector("#subCategories").innerHTML = html;
};

const renderSubCategory = (category) => {
  subCatLength = category.locations.length;
  let html = `<media-carousel>
              <div class="swiper-container w-full h-full">
                <div class="swiper-wrapper">`;
  category.locations.forEach((item) => {
    html += `<div class="swiper-slide bg-ams-white" >
                              <div id="sub" class="mb-6">
                                <div class="grid xmed:grid-cols-40-60">
                                    <div class="cat-image relative">
                                        <div class="absolute bg-ams-white text-xs w-24 left-6 bottom-6 p-2 text-center">${item.category_name}</div>
                                        <img src="${item.image}" class="w-full p-4" alt="${item.imgalt}">
                                    </div>
                                    <div class="px-4">
                                        <div class="flex justify-between">
                                          <div class="title justify-items-start">${item.card_title}</div>
                                          <div class="justify-items-end text-ams-gold pl-3">${item.distance}</div>
                                        </div>
                                        <p class="mb-4 text-sm leading-snug">${item.card_body}</p>
                                    </div>
                                </div>
                              </div>
                            </div>`;
  });
  html += `</div>
              </div>
            </media-carousel>`;

  document.querySelector("#subCategory").innerHTML = html;
  document.querySelector('.swiper-container').addEventListener('slide_changed', e => {
    loadMap(getCategory(index).locations[e.detail.realIndex], true);
  });
};

const loadMap = (category, small) => {
  let locations = [];
  if (!small) {
    category.locations.forEach((item) => {
      if (item.positions.length) {
        item.positions.forEach(locObj =>{
          locations.push(locObj);
        })
      }
    });
  } else {
    if (category.positions.length) {
      category.positions.forEach(locObj=>{
        locations.push(locObj);
      })
    }
  }

  if (locations.length && !mapLoaded) {
    initMap(locations, small ? sub_cat_map_ele : cat_map_ele);
    mapLoaded = 1;
  } else if (locations.length) {
    removeMarkers();
    addMarkers(locations);
  }else{
    removeMarkers();
  }
};
const getCategory = (index) => {
  if (index !== categories.length) return categories[index];

  const obj = {
    title: "ALL CATEGORIES",
    body: "Plan your visit with the help of our guide to the best local experiences and find out what it is like to live like a Silicon Valley native.",
    locations: [],
  };
  categories.forEach((cat) => {
    cat.locations.forEach((loc) => {
      obj.locations.push(loc);
    });
  });
  return obj;
};
const updateUI = (index) => {
  const width = window.innerWidth;
  const category = getCategory(index);
  renderTitleBox(category);
  if (width > 900) {
    renderSubCategories(category);
    loadMap(category, false);
  } else {
    cat_map_ele.style.display = "none";
    renderSubCategory(category);
    loadMap(category.locations[subIndex], true);
  }
};

next_cat.addEventListener("click", function (e) {
  index++;
  index = index > categories.length ? 0 : index;
  updateUI(index);
});

prev_cat.addEventListener("click", function (e) {
  index--;
  index = index < 0 ? categories.length : index;
  updateUI(index);
});

updateUI(0);
