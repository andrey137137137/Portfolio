import { exist } from '@apiHelpers';
import formMixin from '@common/mixins/formMixin';

import { mapActions } from 'vuex';

export default {
  mixins: [formMixin],
  data() {
    return {
      sourceData: {},
      submitData: {},
    };
  },
  computed: {
    disabled() {
      return this.$v.$pending || this.$v.$invalid;
    },
  },
  methods: {
    ...mapActions(['updateData']),
    cloneMultipleArray(array, props) {
      return array.map(item => {
        const object = {};

        for (const key in props) {
          if (props.hasOwnProperty(key)) {
            object[key] = item[key];
          }
        }

        return object;
      });
    },
    getMultipleArray(root, arrayKey, props) {
      return exist(arrayKey, root)
        ? this.cloneMultipleArray(root[arrayKey], props)
        : [];
    },
    defaultFields() {
      return {};
    },
    prepareData() {
      this.submitData = this.item;
    },
    touchInvalidElem() {
      const elemName = this.returnInvalidElem();

      if (!elemName) return true;

      this.$v[elemName].$touch();

      return false;
    },
    reset() {
      const data = this.defaultFields();

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    },
    submit() {
      if (this.$v.$invalid) {
        return false;
      }

      this.prepareData();
      this.updateData({ id: this.item._id, data: this.submitData });

      return true;
    },
  },
};
