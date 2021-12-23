const onMouseDown = function (event) {
    event.preventDefault();
    this.positions.width = this.$refs.divToResize.getBoundingClientRect().width;
    this.positions.height = this.$refs.divToResize.getBoundingClientRect().height;
    this.positions.clientX = event.clientX
    this.positions.clientY = event.clientY
    document.onmousemove = this.elementResize
    document.onmouseup = this.closeElementResize
}

const elementResize = function (event) {
    event.preventDefault();
    this.positions.resizeX = this.positions.width + (event.clientX - this.positions.clientX);
    if(this.positions.resizeX > 350) {
        this.$refs.divToResize.style.width = this.positions.resizeX + 'px'
    }
    this.positions.resizeY = this.positions.height + (event.clientY - this.positions.clientY);
    if(this.positions.resizeY > 200) {
        this.$refs.divToResize.style.height = this.positions.resizeY + 'px'
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