<template lang="pug">
PageWrapper
  UploadForm(
    page='about',
    :breakpoints='breakpoints',
    :stencilProps='stencilProps'
  )
  SkillForm(v-for='skill in dbData', :key='skill._id', :item='skill')
  h3.form-legend Добавить навыки
  SkillForm
</template>

<script>
import PictureInput from 'vue-picture-input';
import { getBreakpointNamesWithoutXL } from '@apiHelpers';
import pageDataMixin from '@backend/mixins/pageDataMixin';
import PageWrapper from '@backCmp/PageWrapper';
import UploadForm from '@backCmp/forms/UploadForm';
import SkillForm from '@backCmp/forms/SkillForm';

export default {
  name: 'AdminAboutView',
  components: {
    PageWrapper,
    PictureInput,
    UploadForm,
    SkillForm,
  },
  mixins: [pageDataMixin],
  data() {
    return {
      stencilProps: {
        aspectRatio: 1.130742049469965,
      },
    };
  },
  computed: {
    breakpoints() {
      return getBreakpointNamesWithoutXL();
    },
  },
};
</script>
