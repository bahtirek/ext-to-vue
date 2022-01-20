
import select from './select';

    const activateOperator = function(operator) {

        // Previous active operator.
        const currentActiveOperator = document.getElementsByClassName('ui-br-ext-active')[0];
        const operatorId = operator.id;

        /**
         * Resetting all operators before switching between operators.
         * The selected element should remain selected when the "Report bug" button is clicked.
         * The selected element will be deselected (red outline will be removed).
         */
        if(currentActiveOperator?.id !== 'ui-br-ext-select-button'){
            resetAllOperators();
        }else if(currentActiveOperator?.id === 'ui-br-ext-select-button' && operatorId === 'ui-br-ext-select-button'){
           resetAllOperators();
        }else if(currentActiveOperator?.id === 'ui-br-ext-select-button' && operatorId !== 'ui-br-ext-report-bug-button'){
            resetAllOperators();
        }
        
        return setOperatorIconStyle(operator);
    };

    /**
     * It is used to set the corresponding class to the operator buttons. 
     * If button is inactive, all other operators switch to inactive state,
     * only the clicked button remains active. If clicked button is active,
     * all operator switch to inactive state, including the clicked operator button.
     * @param {The ID of the clicked operator button} operatorId 
     */
    const setOperatorIconStyle = function(operator){
        let buttonActive = false;
        let operatorClassList = operator.classList;

        if (!operatorClassList.contains('ui-br-ext-active')) {
            document.querySelectorAll('.ui-br-ext-operator').forEach(operator => {
                operator.classList.remove('ui-br-ext-active');
            });
            operator.classList.add('ui-br-ext-active');
            buttonActive = true;
        } else {
            operator.classList.remove('ui-br-ext-active');
            buttonActive = false;
        }
        return buttonActive;
    };

    /**
     * It is used to reset any active operator processes such as 
     * displayed drop down for comment box.
     */
    const resetAllOperators = () => {
        select.onDeselect();
        closeDropdown();
    };

    const openDropdown = (dropItemId) => {

        document.getElementById(dropItemId).classList.add('ui-br-ext-active');
    
    };
    
    const closeDropdown = () => {
    
        document.querySelectorAll('.ui-br-ext-extension .ui-br-ext-dropdown-item').forEach(operator => {
    
            operator.classList.remove('ui-br-ext-active');
    
        });
    }

    const onSelect = () => {
        select.onSelect();
    }

    
    const removeClickFromBodyOnReport = function(){
        select.removeClickFromBody(select.getMouseCoordinates);
    }

    export default {
        activateOperator,
        resetAllOperators,
        setOperatorIconStyle,
        openDropdown,
        closeDropdown,
        onSelect,
        removeClickFromBodyOnReport
    }