<template>
  <div id="app">
    <router-view></router-view>
    <Notification :show="isError && showToast" :msg="errorMsg"/>
  </div>
</template>npm

<script>
    import {mapState, mapActions} from 'vuex';
    import { Notification} from 'components';
    export default {
        name: 'app',
        components:{
            Notification
        },
        computed: mapState({
            showToast: state => state.error.showToast,
            isError: state => state.error.errorStatus,
            errorMsg: state => state.error.errorMsg,
        }),
        created() {
            if (sessionStorage.getItem('isIframe') === 'true') {
                // ToDo (Ben Li) accessing a cross-origin frame.
                document.domain = 'mwpos.cn';
            }
        }
    };
</script>
