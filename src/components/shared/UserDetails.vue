<template>

    <ul class="ui-br-ext-info-list" >
        <li v-if="user && (user.firstname || user.lastname)">
            <span><strong>User: </strong></span>
            <span> {{user.firstname}} {{user.lastname}}</span>
        </li >
        <li v-if="user && user.email">
            <span><strong>Email: </strong></span>
            <span> {{user.email}}</span>
        </li>
    </ul>

</template>

<script>

    export default {
        name: 'UserDetails',

        props: [
            'user'
        ],

    }
</script>