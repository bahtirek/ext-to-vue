<template>
    <div class="ui-br-ext-extension ui-br-ext-alwaysOn" id="ui-br-ext-extension" style="outline: none !important;">
        <MainMenu />
    </div>
</template>  

<script>

import MainMenu from './MainMenu';

export default {
    name: "Extension",
    components: {
        MainMenu,
    }
}
</script>