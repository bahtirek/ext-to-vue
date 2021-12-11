export default {

    // Global variable to hold previously clicked element properties.
    ui_br_ext_previousElement: {  
        element : null,
        parentCount : 0
    },
    
    // Global variable that defines how many parents are included on repeated click on the same element.
    ui_br_ext_parentLimit: 5,

    onSelect: function(){
        console.log('on select');
        const allPointerEvent = 'body *{pointer-events: all!important; }';
        const noHighlight = `*{
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }`;
    
    
        const head = document.head || document.getElementsByTagName('head')[0];
    
        const style = document.createElement('style');
    
        style.setAttribute('id','ui-br-ext-extention-style');    
    
        head.appendChild(style);
    
        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = allPointerEvent+noHighlight;
        } else {
            style.appendChild(document.createTextNode(allPointerEvent+noHighlight));
        }
        this.addClickToHtml(this.getMouseCoordinates);
    },
    
    onDeselect(){
    
        document.getElementById('ui-br-ext-extention-style')?.remove();
    
        this.removeClickFromBody(this.getMouseCoordinates);
        
        // Remove outline from any previously selected elements.
        document.querySelectorAll('.ui-br-ext-outlined-element').forEach(element => {
            element.classList.remove('ui-br-ext-outlined-element');
            element.style.cssText = window.bugReportextention.currentElementInlineStyle;
        });
    
        // Reset the global variable that holds the previously selected element properties.
        // Used to calculte element's parent.
        if(this.ui_br_ext_previousElement){
            this.ui_br_ext_previousElement.element = null,
            this.ui_br_ext_previousElement.parentCount = 0
        }
    
        // Disabling the "Report Bug" button if select operator is turned off.
        this.displayReportBugButton(false);
    
    },
    
    addClickToHtml(eventFunction){
    
        const html = document.getElementsByTagName('html')[0];
    
        html.addEventListener('mousedown', eventFunction, true);
    
        this.addClickBlocker();
    
        this.addHover();
    
    },
    
    removeClickFromBody(eventFunction){
    
        const html = document.getElementsByTagName('html')[0];
    
        html.removeEventListener('mousedown', eventFunction, true);
    
        this.removeClickBlocker();
    
        this.removeHover();
    
    },
    
    getMouseCoordinates(event){
    
        if(event){
            const pageX = event.clientX;
    
            const pageY = event.clientY;
    
            this.findElementFromPoint(pageX, pageY);
    
        } 
        
    },
    
       
    findElementFromPoint(pageX, pageY){
    
        let element = document.elementFromPoint(pageX, pageY);
    
        const retainSelectedElement = document.elementFromPoint(pageX, pageY);
    
        if(element 
           && this.ui_br_ext_previousElement.element !== null
           && this.ui_br_ext_previousElement.parentCount < this.ui_br_ext_parentLimit 
           && element?.closest('#ui-br-ext-extention') === null){
    
            // Previously selected element's top and left coordicates.
            const previousElementRect = this.ui_br_ext_previousElement.element.getBoundingClientRect();
            const previousElementTop = previousElementRect.top;
            const previousElementLeft = previousElementRect.left;
    
            // Currently selected element's top and left coordicates.
            const elementRect = element.getBoundingClientRect();
            const elementTop = elementRect.top;
            const elementLeft = elementRect.left;
    
            if(previousElementTop === elementTop && previousElementLeft === elementLeft){
    
                /**
                 * if selected element's parent is already outlined, then we outline the next parent (up to 5).
                 */
                let parentElement = null;
                let parentOutlined = false;
    
                for(let i = 1; i < this.ui_br_ext_parentLimit; i++){
    
                    parentElement = parentElement !== null
                    ? parentElement.parentElement
                    : element.parentElement;
    
                    if(parentElement?.classList.contains('ui-br-ext-outlined-element')){
                        parentOutlined = true;
                        this.ui_br_ext_previousElement.parentCount ++;
                        break;
                    }
    
                }
    
                if(!parentOutlined){
                    this.ui_br_ext_previousElement.parentCount ++;
                }
    
                element = parentOutlined
                ? parentElement.parentElement
                : element.parentElement;
    
            }
    
        }
    
        this.ui_br_ext_previousElement.element = retainSelectedElement;
    
        if(
            element?.tagName.toLocaleLowerCase() != 'body'
            && element?.tagName.toLocaleLowerCase() != 'html'
            && element?.closest('#ui-br-ext-extention') === null
            ){
                
                this.outlineSelectedElement(element);
                this.displayReportBugButton(true);
                window.bugReportextention.selectedElement = element;
                //Used to crop dynamic elements
                window.bugReportextention.selectedElementRect = element.getBoundingClientRect();
        }
    
        if(this.ui_br_ext_previousElement.parentCount === this.ui_br_ext_parentLimit){
            this.ui_br_ext_previousElement.element = null,
            this.ui_br_ext_previousElement.parentCount = 0
        }
    },
    
    /**
     * It styles the selected element by outlining it.
     * @param {selected element} element 
     */
    outlineSelectedElement: function(element){
    
    
        // Remove outline from any previously selected elements.
        document.querySelectorAll('.ui-br-ext-outlined-element').forEach(element => {
            element.classList.remove('ui-br-ext-outlined-element');
            element.style.cssText = window.bugReportextention.currentElementInlineStyle;
        });
    
        element.classList.add('ui-br-ext-outlined-element');
        window.bugReportextention.currentElementInlineStyle = element.style.cssText;
        element.style.cssText = window.bugReportextention.currentElementInlineStyle + "outline: 3px dashed!important; outline-color: red!important; ";
    
    },
    /**
     * 
     * @param {boolean, true - enables a button, false - disbales a button} enable 
     */
    displayReportBugButton: function(enable){
    
        const reportBugButton = document.getElementById('ui-br-ext-report-bug-button');
    
        reportBugButton.style.display = enable 
        ? reportBugButton.classList.remove('ui-br-ext-report-bug-inactive') 
        : reportBugButton.classList.add('ui-br-ext-report-bug-inactive');    
    
    },
    
    
    /**
     * Gets the xpath of an outlined/selected element.
     * @param {selected/outlined element} element 
     * @returns xpath of outlined/selected element.
     */
    
}