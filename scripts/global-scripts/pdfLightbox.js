import * as basicLightbox from 'basiclightbox';
const LIGHTBOX_KEY = 'lightbox';
const lightBoxElement = document.getElementById('pdf-lightbox');
lightBoxElement.style.display = 'block';
const instance = basicLightbox.create(lightBoxElement, {
    closable: true,
    onClose: (instance) => {
        localStorage.setItem(LIGHTBOX_KEY, 'closed');
    },
    onShow: (instance) => {
        localStorage.setItem(LIGHTBOX_KEY, 'open');
    }
});

const lightBoxState = localStorage.getItem(LIGHTBOX_KEY);
const isLightBoxClosed = lightBoxState === 'closed';
if(!isLightBoxClosed) {
    instance.show();
}
