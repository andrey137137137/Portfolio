<template lang="pug">
PageWrapper
  PostForm(v-for='post in dbData', :key='post._id', :item='post')
  h3.form-legend Добавить запись
  PostForm
</template>

<script>
import pageDataMixin from '@backend/mixins/pageDataMixin';
import PageWrapper from '@backCmp/PageWrapper';
import PostForm from '@backCmp/forms/PostForm';

export default {
  name: 'AdminBlogView',
  components: {
    PageWrapper,
    PostForm,
  },
  mixins: [pageDataMixin],
};
</script>
