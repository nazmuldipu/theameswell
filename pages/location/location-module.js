"use strict";
import "../../components/WeatherWidget/index.js";
import "../../components/MediaCarousel/index.js";
import * as data from "./location.11tydata.json";
const CLOUDFRONT_URL="https://d1bnb47sm4re13.cloudfront.net/"; //TODO, instructed by Mostafa, added by Sarjis
const ameswellLocation = data.ameswell;
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
  const infowindow = new InfoWindow();
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
          const cardEle = document.getElementById(item.id);
          if(cardEle){
            removeAllWhiteBackground();
            cardEle.classList.add('bg-ams-white')
            cardEle.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          // window.scrollBy(0, -80);
          infowindow.open(map, marker);
        };
      })(marker)
    );
  });

  //Add ameswell logo
  let marker = new google.maps.Marker({
    position: { lat: ameswellLocation.lat, lng: ameswellLocation.long },
    title: ameswellLocation.title,
    icon : new google.maps.MarkerImage('images/ameswell_A_mark.png',
    null, null, null, new google.maps.Size(25,25)),
    map,
  });
  markers.push(marker);
  bounds.extend(marker.position);

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

const handleCategories = (categories = [])=> {
const categoryMapElement = document.querySelector("#categoryMap");
const subCategoryMapElement = document.querySelector("#subCategoryMap");
const nextCategory = document.querySelector("#nextCategory");
const previousCategory = document.querySelector("#previousCategory");
let index = categories.length;
let subIndex = 0;
let mapLoaded = 0;
const renderTitleBox = (category) => {
  const titleText = `<div class="text-center xmed:text-left category-header">
                    <h2 class="text-2xl xmed:text-2.5xl font-medium font-serif text-ams-primary">${index === categories.length ? "Live" : category.title
    } like a local</h2>
                    <p class="py-3">${category.body}</p>
                </div>`;
  document.querySelector("#titleBox").innerHTML = titleText;
  document.querySelector("#navTitle").innerHTML = category.title;
};

const removeAllWhiteBackground = () =>{
  const ele = document.querySelectorAll('.sub_cat');
  ele.forEach(item =>{
    item.classList.remove('bg-ams-white')
  })
}

const renderSubCategories = (category) => {
  let html = "";
  category.locations.forEach((item) => {
    const imgSrc = CLOUDFRONT_URL + item.image_.global_image.src;
    const imgalt = item.image_.global_image.alt;
    html += `<div class="mb-10 ">
        <div id="${item.card_title}" class="sub_cat grid xmed:grid-cols-40-60">
            <div class="relative">
                <div class="absolute bg-ams-white text-xs w-24 p-2 top-2 right-2 text-center">${item.category_name}</div>
                <img src="${imgSrc}" class="w-full" alt="${imgalt}">
            </div>
            <div class="xmed:px-4">
                <div class="flex xmed:justify-between xmed:mb-0">
                    <div class="title justify-items-start"><a class="cursor-pointer" href="${item.url}  "target="_blank">${item.card_title}</a></div>
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
  let html = `<media-carousel>
              <div class="swiper-container w-full h-full">
                <div class="swiper-wrapper">`;

  category.locations.forEach((item) => {
    const imgSrc = CLOUDFRONT_URL + item.image_.global_image.src;
    const imgalt = item.image_.global_image.alt;
    html += `<div class="swiper-slide bg-ams-white" >
              <div id="sub" class="mb-6">
                <div class="grid xmed:grid-cols-40-60">
                    <div class="cat-image relative">
                        <div class="absolute bg-ams-white text-xs w-24 left-6 bottom-6 p-2 text-center">${item.category_name}</div>
                        <img src="${imgSrc}" class="w-full p-4 max-h-80 object-cover object-center" alt="${imgalt}">
                    </div>
                    <div class="px-4">
                        <div class="flex justify-between">
                          <div class="title justify-items-start">${item.card_title}</div>
                          <div class="justify-items-end text-ams-gold pl-3">${item.distance}</div>
                        </div>
                        <p class="mb-8 xmed:mb-4 text-sm leading-snug">${item.card_body}</p>
                    </div>
                </div>
              </div>
            </div>`;
  });

  html += `</div>
              </div>
            </media-carousel>`;

  document.querySelector("#subCategory").innerHTML = html;
  document.querySelector('.swiper-container').addEventListener('slideChanged', e => {
    loadMap(getCategory(index).locations[e.detail.realIndex], true);
  });
};

const loadMap = (category, small) => {
  let locations = [];
  if (!small) {
    category.locations.forEach((item) => {
      if (item.positions.length) {
        item.positions.forEach(locObj => {
          locations.push({ ...locObj,
            lat: parseFloat(locObj.lat),
            long: parseFloat(locObj.long),
            "id": item.card_title });
        })
      }
    });
  } else {
    if (category.positions.length) {
      category.positions.forEach(locObj => {
        locations.push(locObj);
      })
    }
  }

  if (locations.length && !mapLoaded) {
    initMap(locations, small ? subCategoryMapElement : categoryMapElement);
    mapLoaded = 1;
  } else if (locations.length) {
    removeMarkers();
    addMarkers(locations);
  } else {
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
    categoryMapElement.style.display = "none";
    renderSubCategory(category);
    loadMap(category.locations[subIndex], true);
  }
};

nextCategory.addEventListener("click", function (e) {
  index++;
  index = index > categories.length ? 0 : index;
  updateUI(index);
});

previousCategory.addEventListener("click", function (e) {
  index--;
  index = index < 0 ? categories.length : index;
  updateUI(index);
});

updateUI(index);
}
document.addEventListener("DOMContentLoaded", function () {
  const html = document.querySelector("#location-component")
  if(html){
      const categories = JSON.parse(html.dataset.categories);
      if(categories && categories.length > 0){
        handleCategories(categories)
        html.dataset.categories = []
      }
  }
})
