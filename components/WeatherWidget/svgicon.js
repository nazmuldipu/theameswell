const svgicon = ( height, width, color, attr ) => {
    return `<svg height='${height}' width='${width}'  fill="${color}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve">${attr}</svg>`
}

export default svgicon