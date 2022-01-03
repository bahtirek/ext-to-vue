<template>
    <div class="ui-br-ext-extension ui-br-ext-alwaysOn" id="ui-br-ext-extension" style="outline: none !important;" v-show="toggleExtensionVal">
        <MainMenu   @toggle-drop="toggleDrop"   @toggle-extension="toggleExtension" />
        <Dropdown   :dropToToggle="dropToToggle"   @toggle-extension="toggleExtension" />
    </div>
</template>  

<script>

import MainMenu from './MainMenu';
import Dropdown from './Dropdown';

export default {
    name: "Extension",
    components: {
        MainMenu,
        Dropdown
    },
    
    data() {
        return {
            dropToToggle: {},
            toggleExtensionVal: true
        }
    },
    methods: {
        toggleDrop(data) {
            this.dropToToggle = data;
        },
        toggleExtension(val){
            this.toggleExtensionVal = !this.toggleExtensionVal;
        }
        
    }
}
</script>

