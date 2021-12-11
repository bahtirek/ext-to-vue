<template>
    <div class="ui-br-ext-header" id="ui-br-ext-header"  style="outline: none !important;">
        <div class="ui-br-ext-menu-container ui-br-ext-container ui-br-ext-alwaysOn">
            <SelectBtn />
            <span class="ui-br-ext-operator ui-br-ext-alwaysOn ui-br-ext-report-bug-inactive" @click="onSelect"  data-title="Report bug" id="ui-br-ext-report-bug-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </span>
            <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="View bug" @click="onSelect" id="ui-br-ext-view-bug-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 9 9 9 8 9"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Export" @click="onSelect" id="ui-br-ext-export-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Settings" @click="onSelect" id="ui-br-ext-settings-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-settings">
                    <circle cx="12" cy="12" r="3" />
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </span>
            <span class="ui-br-ext-operator ui-br-ext-alwaysOn" data-title="Close" @click="onSelect"  id="ui-br-ext-close-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f04242" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="ui-br-ext-feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" /></svg>
            </span>
        </div>
    </div>
</template>

<script>

    /* import select from '../shared/select';
    import operators from '../shared/operators'; */
    import SelectBtn from './SelectBtn';

    export default {
        name: 'MainMenu',
        components: {
            SelectBtn
        },
        created() { 
            /* this.onDeselect = select.onDeselect;
            this.closeDropdown = select.closeDropdown;
            this.setOperatorIconStyle = operators.setOperatorIconStyle */
        },

        methods: {

            onSelect(e) {
                //this.setOperatorIconStyle(e.currentTarget);
            },
            
        }
    }
</script>