<template>
  <base-form
    name="账单备注"
    :form="detail"
    :submitForm="onSubmit"
  >
  </base-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BaseForm } from '../components';

export default {
  name: 'BillNote',
  components: {
    BaseForm
  },
  data () {
    return {
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    const { id } = this.$route.params;
    if (id) {
      await this.fetchBillNoteDetail(id);
    }
  },
  computed: mapState({
    error: state => state.error.errorStatus,
    detail () {
      const { detail } = this.$store.state.businessSetting.billNote;
      return this.isEdit ? { ...detail, reason: detail.word } : { };
    }
  }),
  methods: {
    ...mapActions([
      'fetchBillNoteDetail',
      'saveBillNote',
      'updateBillNote'
    ]),
    async onSubmit (form) {
      if (this.isEdit) {
        await this.updateBillNote(form);
      } else {
        await this.saveBillNote(form);
      }

      const { errorStatus } = this.error;
      if (!errorStatus) {
        this.$router.back();
      }
    }
  }
};
</script>

<style lang="scss">
.business-setting-form {
  width: 35%;
  margin: auto;
  padding: 15px;

  .btn-wrap {
    text-align: center;
  }
}
</style>
