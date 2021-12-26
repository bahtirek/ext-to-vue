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

const closeElementResize = function() {
    document.onmouseup = null
    document.onmousemove = null
}

export default {
    onMouseDown,
    elementResize,
    closeElementResize
}