<template>
    <div class="ui-br-ext-dropdown-item ui-br-ext-review" id="ui-br-ext-review">
                <div class="ui-br-ext-drop-title">Review</div>
                <div class="ui-br-ext-drop-body">
                    <div class="ui-br-ext-view-bug-box" id="ui-br-ext-view-bug-description">
                        <div class="ui-br-ext-view-bug-title">Description</div>
                        <div class="ui-br-ext-view-bug-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptas iste similique? Dolores consequuntur necessitatibus exercitationem aperiam ea dolorum deleniti nobis delectus eveniet qui. Sint perspiciatis tenetur asperiores cum distinctio!</div>
                    </div>
                    <div class="ui-br-ext-view-bug-box" id="ui-br-ext-view-bug-actual-results">
                        <div class="ui-br-ext-view-bug-title">Actual results</div>
                        <div class="ui-br-ext-view-bug-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptas iste similique? Dolores consequuntur necessitatibus exercitationem aperiam ea dolorum deleniti nobis delectus eveniet qui. Sint perspiciatis tenetur asperiores cum distinctio!</div>
                    </div>
                    <div class="ui-br-ext-view-bug-box" id="ui-br-ext-view-bug-expected-results">
                        <div class="ui-br-ext-view-bug-title">Expected results</div>
                        <div class="ui-br-ext-view-bug-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptas iste similique? Dolores consequuntur necessitatibus exercitationem aperiam ea dolorum deleniti nobis delectus eveniet qui. Sint perspiciatis tenetur asperiores cum distinctio!</div>
                    </div>
                    <div class="ui-br-ext-view-bug-box" id="ui-br-ext-view-bug-reproduce">
                        <div class="ui-br-ext-view-bug-title">Steps to reproduce</div>
                        <div class="ui-br-ext-view-bug-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem voluptas iste similique? Dolores consequuntur necessitatibus exercitationem aperiam ea dolorum deleniti nobis delectus eveniet qui. Sint perspiciatis tenetur asperiores cum distinctio!</div>
                    </div>
                </div>
                <div class="ui-br-ext-box-resize" id="ui-br-review-boxResize">
                    <svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" focusable="false"
                        role="img" width="128" height="128" fill="currentColor">
                        <path d="M33,11H3a1,1,0,0,0,0,2H33a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-1" />
                        <path d="M28,17H8a1,1,0,0,0,0,2H28a1,1,0,0,0,0-2Z" class="ui-br-ext-clr-i-outline clr-i-outline-path-2" />
                        <path d="M23,23H13a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"
                            class="ui-br-ext-clr-i-outline clr-i-outline-path-3" /></svg>
                </div>
            </div>
</template>


<script>

    import { globalStore } from './../../main';
    import eventBus from './../../eventBus'

    export default {
        name: 'SettingsDrop',
        components: {
           
        },

        mounted: function () {
            this.account = globalStore?.store?.account;
            this.currentProject = globalStore?.store.currentProject;

            eventBus.$on('account-loaded', (val) => {
                this.account = globalStore.store.account;
                this.currentProject = globalStore.store.currentProject;
            })
        },

        data() {
            return {
                ifProject: false,
                ifAccount: false,
                ifUser: false,
                currentProject: {},
                account: {},
            }
        },

        methods: {
            
        }
    }
</script>