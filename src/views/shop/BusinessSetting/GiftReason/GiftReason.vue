<template>
  <base-form
    name="赠菜理由"
    :form="detail"
    :submitForm="onSubmit"
  >
  </base-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BaseForm } from '../components';

export default {
  name: 'GiftReason',
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
      await this.fetchGiftReasonDetail(id);
    }
  },
  computed: mapState({
    error: state => state.error,
    detail () {
      const { detail } = this.$store.state.businessSetting.giftReason;
      return this.isEdit ? { ...detail, reason: detail.word } : { };
    }
  }),
  methods: {
    ...mapActions([
      'fetchGiftReasonDetail',
      'saveGiftReason',
      'updateGiftReason'
    ]),
    async onSubmit (form) {
      if (this.isEdit) {
        await this.updateGiftReason(form);
      } else {
        await this.saveGiftReason(form);
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
