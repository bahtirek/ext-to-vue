import eventBus from '../eventBus';


const addClickBlocker = function(bodyChildren) {
    if(!bodyChildren) {
        bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extension):not(script):not(noscript):not(style)')
    }
    bodyChildren.forEach(el => {
        el.addEventListener('click', preventClick, {capture: true});
        el.addEventListener('mousedown', preventClick, {capture: true});
    });
}

const removeClickBlocker = function(bodyChildren) {
    if(!bodyChildren) {
        bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extension):not(script):not(noscript):not(style)')
    }
    bodyChildren.forEach(el => {
        el.removeEventListener('click', preventClick, {capture: true});
        el.removeEventListener('mousedown', preventClick, {capture: true});
    });
}

const preventClick = (event) => preventClickHandler(event);

const preventClickHandler = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    if(event.type == 'click') {
        showDetailsOnClick(event.target);
    }
    return false;
}

const showDetailsOnClick = function(el) {
    const index = el.getAttribute('data-ext-index');
    if(index && index >= 0) {
        console.log(index);
        eventBus.$emit('show-details', index);
    } else {
        return false
    }
}

export default {
    preventClick,
    addClickBlocker,
    removeClickBlocker,
    preventClickHandler
}