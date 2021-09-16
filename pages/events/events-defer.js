const showAllBtn = document.querySelector('.show-all__amenities');
const eventsSvgIcon = document.querySelectorAll('.events__svgicon');
console.log(eventsSvgIcon.length);
showAllBtn.addEventListener("click", (e)=>{
    for (let index = 0; index < eventsSvgIcon.length; index++) {
        eventsSvgIcon[index].classList.add('grid');
    }
    showAllBtn.classList.add('hidden');
})