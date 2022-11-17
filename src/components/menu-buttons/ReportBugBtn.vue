<template>
    <span class="ui-br-ext-operator ui-br-ext-alwaysOn ui-br-ext-report-bug-inactive" @click="toggleBtn"  data-title="Report bug" id="ui-br-ext-report-bug-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
    </span>
</template>

<script>

    import { globalStore } from '../../main';

    export default {
        name: 'ReportBugBtn',

        props: ['toggleCompleted'],

        created() { 
            //this.onSelect = operators.onSelect;
        },

        data() {
            return {
                next: false
            }
        },

        methods: {

            toggleBtn(e) {
                this.$emit('toggle-button', e.currentTarget);
                this.moveElementToViewport();
            },

            moveElementToViewport(){
                const isInViewport = this.isElementInViewport(globalStore.store.selectedElement);
                if(!isInViewport){
                    globalStore.store.selectedElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
                    //intersectionObserver.observe(globalStore.store.selectedElement);
                }
            },

            isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            },


            /* intersectionObserver = new IntersectionObserver((entries) => {
            let [entry] = entries;
            if (entry.isIntersecting) {
                setTimeout(() => alert(`${entry.target.id} is visible`), 100)
            }
            }), */
            
        }
    }
</script>

