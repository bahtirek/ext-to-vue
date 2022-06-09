const removeOutline =  function(){
    document.querySelectorAll('.ui-br-ext-outlined-element').forEach(element => {
        element.classList?.remove('ui-br-ext-outlined-element');
        element.style.cssText = element.style.cssText.replace('outline: red dashed 3px !important;', '');
        element.style.cssText = element.style.cssText.replace('outline: #4fff00 dashed 3px !important;', '');
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
        element.style.cssText = element.style.cssText + "outline: red dashed 3px !important;";  
    }
}

export default {
    outlineElement,
    removeBugCoverEls,
    removeOutline
}