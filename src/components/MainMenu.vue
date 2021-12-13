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
            this.removeClickFromBodyOnReport = operators.removeClickFromBodyOnReport;
        },
        data() {
            return {
                toggleCompleted: false
            }
        },
        methods: {

            toggleButton(el) {
                this.toggleCompleted = this.activateOperator(el);//Activate button
                this.toggleDrops(el.id, this.toggleCompleted); //Expand dropdown if exist
                if(el.id == 'ui-br-ext-report-bug-button') {
                    console.log(el.id);
                    this.removeClickFromBodyOnReport();
                }
            },  
            
            toggleDrops(id, state){
                id = id.replace('ui-br-ext-', "").replace(/-/g, "").replace('button', '');
                this.$emit('toggle-drop', {id: id, state: state});
            }
        }
    }
</script>