import eventBus from '../eventBus';
import { globalStore } from '../main.js';

const blockBugElement = function(element) {
    if(!element) return false;
    element.addEventListener('mousedown', preventClick, {capture: true});
    element.addEventListener('mouseup', preventClick, {capture: true});
    element.addEventListener('dblclick', preventClick, {capture: true});
    element.addEventListener('click', showDetailsOnClickWithClass, {capture: true});
}

const unblockBugElements = function(elements) {
    if(!elements) {
        elements = document.querySelectorAll('[class^=ui-br-ext-searched-element-id-]') 
    }
    elements.forEach(element => {
        element.removeEventListener('mousedown', preventClick, true);
        element.removeEventListener('mouseup', preventClick, true);
        element.removeEventListener('dblclick', preventClick, true);
        element.removeEventListener('click', showDetailsOnClickWithClass, true);
        element.classList.remove('ui-br-ext-outlined-element', 'ui-br-ext-selected-element-outline-red', 'ui-br-ext-outlined-element-childs-no-events', 'ui-br-ext-selected-element-outline-green');
        //removing unique dynamic class
        element.classList.forEach((className) => {
            if(className.includes('ui-br-ext-searched-element-id-')) {
                element.classList.remove(className)
            }
        });
    })
    globalStore.store.activeBugElement = null;
}

const showDetailsOnClickWithClass = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    let bugId = "";
    const prevEl = globalStore.store.activeBugElement;
    const element = event.target;
    
    element.classList.forEach((className) => {
        if(className.includes('ui-br-ext-searched-element-id-')) {
            bugId = className.replace('ui-br-ext-searched-element-id-', '');
            element.classList.add('ui-br-ext-selected-element-outline-green');
            element.classList.remove('ui-br-ext-selected-element-outline-red');
        } else {
            return false;
        }
    });

    if(prevEl){
        prevEl.classList.add('ui-br-ext-selected-element-outline-red');
        prevEl.classList.remove('ui-br-ext-selected-element-outline-green');                  
    }

    eventBus.$emit('show-details', bugId);
    globalStore.store.activeBugElement = element;
}

const preventClick = (event) => preventClickHandler(event);

const preventClickHandler = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    return false;
}

export default {
    blockBugElement,
    unblockBugElements
}