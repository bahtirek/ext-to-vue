import eventBus from '../eventBus';


const addClickBlocker = function(bodyChildren) {
    if(!bodyChildren) {
        bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extension):not(script):not(noscript):not(style)')
    }
    bodyChildren.forEach(el => {
        el.addEventListener('click', preventClick, {capture: true});
        el.addEventListener('mousedown', preventClick, {capture: true});
        el.addEventListener('mouseup', preventClick, {capture: true});
        el.addEventListener('dblclick', preventClick, {capture: true});
    });
}

const removeClickBlocker = function(bodyChildren) {
    if(!bodyChildren) {
        bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extension):not(script):not(noscript):not(style)')
    }
    bodyChildren.forEach(el => {
        el.removeEventListener('click', preventClick, true);
        el.removeEventListener('mousedown', preventClick, true);
        el.removeEventListener('mouseup', preventClick, true);
        el.addEventListener('dblclick', preventClick, {capture: true});
        el.classList.remove('ui-br-ext-outlined-element');
        el.classList.remove('ui-br-ext-selected-element-outline-green');
        el.classList.remove('ui-br-ext-selected-element-outline-red');
    });
}

const preventClick = (event) => preventClickHandler(event);

const preventClickHandler = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    return false;
}

export default {
    preventClick,
    addClickBlocker,
    removeClickBlocker,
    preventClickHandler
}