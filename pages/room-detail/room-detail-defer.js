const items = document.querySelectorAll(".accordion-item");

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

items.forEach((item) => {
  const btns = item.querySelectorAll(".accordion-button");
  const content = item.querySelector(".accordion-content");
  const parentItem = item.parentElement;
  const cmp = parentItem.querySelector(".summury");
  btns.forEach((btn) => {
    const icon = btn.querySelector(".arrow");
    icon.style.transform = "rotate(135deg)";
    content.style.display = "none";    

    btn.addEventListener("click", function () {
      if (content.style.display === "block") {
        content.style.display = "none";
        content.style.marginBottom = "0px";
        item.classList.remove("bg-ams-base");
        if (screen.width < 900) {
          cmp.classList.remove("bg-ams-base");
          cmp.classList.add("bg-ams-white");
          cmp.classList.add("shadow-sm");
          cmp.classList.add("xmed:shadow-md");
        }
        icon.style.transform = "rotate(135deg)";
        icon.style.marginTop = "0px";
      } else {
        content.style.display = "block";
        content.style.marginBottom = "20px";
        
        item.classList.add("bg-ams-base");
        if (screen.width < 900) {
          cmp.classList.add("bg-ams-base");
          cmp.classList.remove("bg-ams-white");
          cmp.classList.remove("shadow-sm");
          cmp.classList.remove("xmed:shadow-md");
        }
        icon.style.marginTop = "10px";
        icon.style.transform = "rotate(-45deg)";

        const carNavs = content.querySelectorAll(".car-nav");
        carNavs.forEach((carNav) => {
          carNav.style.top = (carNav.offsetWidth / 3) + 'px'
        });       
      }
    });
  });
});
