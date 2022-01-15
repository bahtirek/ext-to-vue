const preventClick = (event) => preventClickHandler(event);

const addClickBlocker = function() {
    const bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extension):not(script):not(noscript):not(style)');
    bodyChildren.forEach(el => {
        el.addEventListener('click', preventClick, {capture: true});
    });
}

const removeClickBlocker = function() {
    const bodyChildren = document.querySelectorAll('body > *:not(#ui-br-ext-extension):not(script):not(noscript):not(style)');
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

export default {
    preventClick,
    addClickBlocker,
    removeClickBlocker,
    preventClickHandler
}