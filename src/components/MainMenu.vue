<template>
    <div class="ui-br-ext-header" id="ui-br-ext-header"  style="outline: none !important;">
        <div class="ui-br-ext-menu-container ui-br-ext-container ui-br-ext-alwaysOn">
            <SelectBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
            <ReportBugBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
            <ViewReportBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
            <ExportBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
            <SettingsBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
            <CloseBtn @toggle-button="toggleButton" :toggleCompleted="toggleCompleted" />
            
            
            
            
        </div>
    </div>
</template>

<script>

    import SelectBtn from './menu-buttons/SelectBtn';
    import ReportBugBtn from './menu-buttons/ReportBugBtn';
    import ViewReportBtn from './menu-buttons/ViewReportBtn';
    import ExportBtn from './menu-buttons/ExportBtn';
    import SettingsBtn from './menu-buttons/SettingsBtn';
    import CloseBtn from './menu-buttons/CloseBtn';
    import operators from '../shared/operators';

    export default {
        name: 'MainMenu',
        components: {
            SelectBtn,
            ReportBugBtn,
            ViewReportBtn,
            ExportBtn,
            SettingsBtn,
            CloseBtn
        },
        created() { 
            this.activateOperator = operators.activateOperator;
            this.onSelect = operators.onSelect;
            this.openDropdown = operators.openDropdown;
            this.setOperatorIconStyle = operators.setOperatorIconStyle;
        },
        data() {
            return {
                toggleCompleted: false
            }
        },
        methods: {

            toggleButton(el) {
                this.toggleCompleted = this.activateOperator(el);
            },


            onSelect1(el) {
                console.log(el);
            },
            
        }
    }
</script>