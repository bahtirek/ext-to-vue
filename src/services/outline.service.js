const removeOutline =  function(){
    document.querySelectorAll('.ui-br-ext-outlined-element').forEach(element => {
        element.classList?.remove('ui-br-ext-outlined-element');
        element.classList?.remove('ui-br-ext-selected-element-outline-green');
        element.classList?.remove('ui-br-ext-selected-element-outline-red');
        element.removeAttribute('data-ext-index');
    });
}

const removeBugCoverEls =  function(){
    document.querySelectorAll('.ui-br-ext-bug-cover').forEach(el => {
        el.remove()
    });
}

const outlineElement =  function(xpath){
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
    if(element) {
        element.classList.add('ui-br-ext-outlined-element');
        element.classList.add('ui-br-ext-selected-element-outline-red');
    }
}

export default {
    outlineElement,
    removeBugCoverEls,
    removeOutline
}