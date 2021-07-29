import { googleMaps } from "../../scripts/googleMaps";
let locations = [];

const showDesktopViewMap = (activElement, mapElement) => {
  locations = [];
  activElement.querySelectorAll(".cat_item").forEach((ci) => {
    const title = ci.querySelector(".title").innerHTML;
    const loc = ci.querySelector(".location").innerHTML.split("/");
    if (loc[0] !== "") {
      const locObj = { title, lat: loc[0], long: loc[1] };
      locations.push(locObj);
    }
  });
  if (locations.length) {
    document.addEventListener("load", googleMaps(mapElement, locations));
  } else{
      mapElement.innerHTML = "Location info not found"
  }
};

const showMobileViewMap = (xsMapContainer) => {
  locations = [];
  const mobileElement = xsMapContainer.querySelector(
    ".child-slide.swiper-slide-active"
  );
  const mobileMapElement = mobileElement.querySelector(".sub_cat_map");
  const item = mobileElement.querySelector(".sub_cat_item ");
  const title = item.querySelector(".title").innerHTML;
  const loc = item.querySelector(".location").innerHTML.split("/");
  const locObj = { title, lat: loc[0], long: loc[1] };
  locations.push(locObj);
  if (locObj.lat > 0) {
    document.addEventListener(
      "load",
      googleMaps(mobileMapElement, locations, { zoom: 11, top: 13 })
    );
  }
};

const actionMap = () => {
  setTimeout(function () {
    const activElement = document.querySelector(
      ".parent-slide.swiper-slide-active"
    );
    const deskMapEle = activElement.querySelector(".cat_map");
    const xsMapCon = activElement.querySelector(".mobile_map");

    if (deskMapEle && deskMapEle.offsetWidth && deskMapEle.offsetWidth > 0) {
      showDesktopViewMap(activElement, deskMapEle);
    } else if (xsMapCon && xsMapCon.offsetWidth && xsMapCon.offsetWidth > 0) {

      document.querySelectorAll(".carousel-prev").forEach(function (el) {
        el.addEventListener("click", function (e) {
          showMobileViewMap(xsMapCon);
        });
      });
      document.querySelectorAll(".carousel-next").forEach(function (el) {
        el.addEventListener("click", function (e) {
          showMobileViewMap(xsMapCon);
        });
      });

      setTimeout(function () {
        showMobileViewMap(xsMapCon);
      }, 500);
    }
  }, 500);
};

document.querySelectorAll(".carousel-button-prev").forEach(function (el) {
  el.addEventListener("click", function (e) {
    actionMap();
  });
});

document.querySelectorAll(".carousel-button-next").forEach(function (el) {
  el.addEventListener("click", function (e) {
    actionMap();
  });
});

setTimeout(function () {
  actionMap();
}, 2000);

