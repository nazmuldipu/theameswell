import * as basicLightbox from 'basiclightbox';

const instance = basicLightbox.create(`
<iframe src="https://docs.google.com/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true" style="width:80vw; height:600px;" frameborder="0"></iframe>
`, {
    closable: true,
});

instance.show();
