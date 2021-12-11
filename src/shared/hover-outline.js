const bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extention):not(script):not(noscript):not(style)');

const preventClick = (event) => preventClickHandler(event);

const addClickBlocker = function() {
    bodyChildren.forEach(el => {
        el.addEventListener('click', preventClick, {capture: true});
    });
}

const removeClickBlocker = function() {
    bodyChildren.forEach(el => {
        el.removeEventListener('click', preventClick, {capture: true});
    });
}

const preventClickHandler = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    return false;
}


const hoverOn = (event) => hoverOnHandler(event);
const hoverOff = (event) => hoverOffHandler(event);

const addHover = function() {
    const body = document.querySelector('body');
    body.addEventListener('mouseover', hoverOn);
    body.addEventListener('mouseout', hoverOff);
}

const removeHover = function() {
    const body = document.querySelector('body');
    body.removeEventListener('mouseover', hoverOn);
    body.removeEventListener('mouseout', hoverOff);
}

const hoverOnHandler = function(event) {
    event.target.classList.add('ui-br-ext-hovered');
}

const hoverOffHandler = function(event) {
    event.target.classList.remove('ui-br-ext-hovered');
}

export default {
    bodyChildren,
    preventClick,
    addClickBlocker,
    removeClickBlocker,
    preventClickHandler,
    hoverOn,
    hoverOff,
    addHover,
    removeHover,
    hoverOnHandler,
    hoverOffHandler
}