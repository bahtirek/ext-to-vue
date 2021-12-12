<template>
    <div class="ui-br-ext-extension ui-br-ext-alwaysOn" id="ui-br-ext-extension" style="outline: none !important;">
        <MainMenu @toggle-drop="toggleDrop"/>
        <Dropdown :dropToToggle="dropToToggle" />
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
            dropToToggle: {}
        }
    },
    methods: {
        toggleDrop(data) {
                console.log(data);
            this.dropToToggle = data;
        }
    }
}
</script>

