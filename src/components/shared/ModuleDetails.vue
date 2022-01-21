<template>
    <ul class="ui-br-ext-info-list">
        <li v-if="module && module.name">
            <span><strong> Module label: </strong></span>
            <span v-if="module"> {{module.name || 'No module chosen'}}</span>
        </li>
    </ul>
</template>

<script>

    export default {
        name: 'ModuleDetails',

        props: [
            'module'
        ],

        methods: {

        }
    }
</script>