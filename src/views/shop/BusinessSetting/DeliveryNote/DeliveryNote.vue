<template>
  <base-form
    name="外送备注"
    :form="detail"
    :submitForm="onSubmit"
  >
  </base-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BaseForm } from '../components';

export default {
  name: 'DeliveryNote',
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
      await this.fetchDeliveryNoteDetail(id);
    }
  },
  computed: mapState({
    error: state => state.error,
    detail () {
      const { detail } = this.$store.state.businessSetting.deliveryNote;
      return this.isEdit ? { ...detail, reason: detail.word } : { };
    }
  }),
  methods: {
    ...mapActions([
      'fetchDeliveryNoteDetail',
      'saveDeliveryNote',
      'updateDeliveryNote'
    ]),
    async onSubmit (form) {
      if (this.isEdit) {
        await this.updateDeliveryNote(form);
      } else {
        await this.saveDeliveryNote(form);
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
