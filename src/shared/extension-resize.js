let positions = {};

const onMouseDown = function (event) {
    event.preventDefault();
    positions.width = this.$refs.divToResize.getBoundingClientRect().width;
    positions.height = this.$refs.divToResize.getBoundingClientRect().height;
    positions.clientX = event.clientX
    positions.clientY = event.clientY
    positions.element = this.$refs.divToResize
    document.onmousemove = elementResize
    document.onmouseup = closeElementResize
}
const onTouchStart = function (event) {
    event.preventDefault();
    event.stopPropagation();
    const touchevent = event.touches[0];
    positions.width = this.$refs.divToResize.getBoundingClientRect().width;
    positions.height = this.$refs.divToResize.getBoundingClientRect().height;
    positions.clientX = touchevent.clientX
    positions.clientY = touchevent.clientY
    positions.element = this.$refs.divToResize
    document.ontouchmove = onTouchResize
    document.ontouchend = closeElementResize
}

const elementResize = function (event) {
    event.preventDefault();
    positions.resizeX = positions.width + (event.clientX - positions.clientX);
    if(positions.resizeX > 350) {
        positions.element.style.width = positions.resizeX + 'px'
    }
    positions.resizeY = positions.height + (event.clientY - positions.clientY);
    if(positions.resizeY > 200) {
        positions.element.style.height = positions.resizeY + 'px'
    }
}

const onTouchResize = function (event) {
    event.preventDefault();
    const touchevent = event.touches[0];
    positions.resizeX = positions.width + (touchevent.clientX - positions.clientX);
    if(positions.resizeX > 250 && positions.resizeX < 330) {
        console.log(positions.resizeX, window.innerWidth);
        positions.element.style.width = positions.resizeX + 'px'
    }
    positions.resizeY = positions.height + (touchevent.clientY - positions.clientY);
    if(positions.resizeY > 200) {
        positions.element.style.height = positions.resizeY + 'px'
    }
}

const closeElementResize = function() {
    document.onmouseup = null
    document.onmousemove = null
    document.ontouchend = null
    document.ontouchmove = null
}

export default {
    onMouseDown,
    elementResize,
    closeElementResize,
    onTouchResize,
    onTouchStart
}