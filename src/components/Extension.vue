<template>
    <div class="ui-br-ext-extension ui-br-ext-alwaysOn" id="ui-br-ext-extension" style="outline: none !important;" v-show="toggleExtensionVal">
        <MainMenu   @toggle-drop="toggleDrop"   @toggle-extension="toggleExtension" />
        <Dropdown   :dropToToggle="dropToToggle"   @toggle-extension="toggleExtension" />
        <div class="ui-br-ext-toast" :class="{'ui-br-ext-toast-width': showToast}">
            <div class="ui-br-ext-toast-container">
                <div class="ui-br-ext-toast-body" :class="{ 'ui-br-ext-toast-show': showToast, 'ui-br-ext-bg-danger': dangerToast }">
                    <div class="ui-br-ext-toast-text">{{toastText}}</div>
                    <div class="ui-br-ext-toast-close" @click="hideToast"></div>
                </div>

            </div>
        </div>
        <a href="" id="ui-br-ext-download-image-full" style="display: none"></a>
        <a download="message.eml" id="ui-br-ext-download-email" style="display: none"></a>
    </div>
</template>  

<script>

import MainMenu from './MainMenu';
import Dropdown from './Dropdown';
import eventBus from '../eventBus';

export default {
    name: "Extension",
    components: {
        MainMenu,
        Dropdown
    },
    
    data() {
        return {
            dropToToggle: {},
            toggleExtensionVal: true,
            showToast: false,
            dangerToast: false,
            toastText: ''
        }
    },

    mounted() {
        eventBus.$on('toggle-toast', (data) => {
            this.toastText = data.text;
            this.dangerToast = data.danger;
            this.showToast = true;
        })
    },
    methods: {
        toggleDrop(data) {
            this.dropToToggle = data;
        },
        toggleExtension(val){
            this.toggleExtensionVal = !this.toggleExtensionVal;
        },
        hideToast(){
            this.showToast = false;
            this.toastText = '';
        }
    },

}
</script>

