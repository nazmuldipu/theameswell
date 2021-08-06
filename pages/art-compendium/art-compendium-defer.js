const readMoreBtn = document.querySelectorAll(".read-more__btn");
const moreText = document.querySelectorAll(".moreText");

for (let i = 0; i < readMoreBtn.length; i++) {
    readMoreBtn[i].addEventListener("click", (e) => {
        moreText[i].classList.toggle('active') ? readMoreBtn[i].innerText = "READ LESS" : readMoreBtn[i].innerText = "READ MORE";
    })
}