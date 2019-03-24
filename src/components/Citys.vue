<template>
  <el-cascader
    :options="citys"
    :props="props"
    v-model="selectedOptions"
    @change="getSelectValue"
    @active-item-change="onChangeItem"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'citys',
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    getSelectValue: {
      typs: Function,
      default: () => {}
    }
  },
  data () {
    return {
      selectedOptions: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      }
    };
  },
  watch: {
    async selected () {
      const [provinceId, cityId] = this.selected;
      await this.fetchProvinces();
      if (cityId) {
        await this.fetchCitys({ provinceId });
        await this.fetchDistrict({ provinceId, cityId });
      }

      this.selectedOptions = this.selected;
    }
  },
  async created () {
    await this.fetchProvinces();
  },
  computed: mapState({
    citys: state => state.sysetymenu.citys
  }),
  methods: {
    ...mapActions([
      'fetchProvinces',
      'fetchCitys',
      'fetchDistrict'
    ]),
    async onChangeItem (val) {
      if (val.length === 1) {
        await this.fetchCitys({ provinceId: val.toString() });
      }

      if (val.length === 2) {
        const [provinceId, cityId] = val;
        await this.fetchDistrict({ provinceId, cityId });
      }
    }
  }
};
</script>

<style lang="scss">

</style>
