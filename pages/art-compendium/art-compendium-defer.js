const readMoreBtn = document.querySelectorAll(".read-more__btn");
const moreText = document.querySelectorAll(".moreText");
const toggleArrow=document.querySelectorAll(".toggle-arrow");

for (let i = 0; i < readMoreBtn.length; i++) {
    readMoreBtn[i].addEventListener("click", (e) => {
        moreText[i].classList.toggle('active') ? readMoreBtn[i].innerText = "LESS" : readMoreBtn[i].innerText = "MORE";
        toggleArrow[i].classList.toggle('active');
    })
}