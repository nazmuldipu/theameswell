import * as basicLightbox from 'basiclightbox';

const instance = basicLightbox.create(`
<iframe width="1100" height="800" frameborder="0" src="https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true"></iframe>
`, {
    closable: true,
});

instance.show();
