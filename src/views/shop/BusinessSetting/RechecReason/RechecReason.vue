<template>
  <base-form
    name="反结账理由"
    :form="detail"
    :submitForm="onSubmit"
  >
  </base-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BaseForm } from '../components';

export default {
  name: 'RechecReason',
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
      await this.fetchRechecReasonDetail(id);
    }
  },
  computed: mapState({
    error: state => state.error,
    detail () {
      const { detail } = this.$store.state.businessSetting.rechecReason;
      return this.isEdit ? { ...detail, reason: detail.word } : { };
    }
  }),
  methods: {
    ...mapActions([
      'fetchRechecReasonDetail',
      'saveRechecReason',
      'updateRechecReason'
    ]),
    async onSubmit (form) {
      if (this.isEdit) {
        await this.updateRechecReason(form);
      } else {
        await this.saveRechecReason(form);
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
