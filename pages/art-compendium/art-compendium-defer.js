const readMoreBtn = document.querySelectorAll(".read-more__btn");
const moreText = document.querySelectorAll(".moreText");
const toggleArrow=document.querySelectorAll(".toggle-arrow");

for (let i = 0; i < readMoreBtn.length; i++) {
    readMoreBtn[i].addEventListener("click", (e) => {
        moreText[i].classList.toggle('active') ? readMoreBtn[i].innerText = "LESS" : readMoreBtn[i].innerText = "MORE";
        toggleArrow[i].classList.toggle('active');
    })
}
const trim = (str) => {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
};
const addClass = (el, cn) => {
    if (!hasClass(el, cn)) {
        el.className = (el.className === '') ? cn : el.className + ' ' + cn;
    }
}
const removeClass = (el, cn) => {
    el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
}
const hasClass = (el, cn) => {
    return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
}

const getYPosition = (el) => {
    let yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            let yScroll = el.scrollTop || document.documentElement.scrollTop;
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }
        el = el.offsetParent;
    }
    return yPos;
}

const artComponent = document.querySelector('#artComponent');
let currentBg = '';
document.addEventListener('scroll', function (e) {
    const panels = document.querySelectorAll('.panel');
    panels.forEach(el => {
        const yPos = getYPosition(el);
        if (yPos < 300 && yPos + el.offsetHeight > 300) {
            const dataColor = el.getAttribute('data-color')
            removeClass(artComponent, currentBg);
            addClass(artComponent, dataColor);
            currentBg = dataColor;
        }
    })
});
