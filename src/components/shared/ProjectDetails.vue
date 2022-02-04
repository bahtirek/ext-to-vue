<template>
    <ul class="ui-br-ext-info-list">
        <li v-if="project && project.projectKey">
            <span><strong>Project key: </strong></span>
            <span v-if="project"> {{project.projectKey || 'No project chosen'}}</span>
        </li>
    </ul>
</template>

<script>

    export default {
        name: 'ProjectDetails',

        props: [
            'project'
        ]
    }
</script>