<template lang="pug">
ul.section.footer_top
  li.container.footer_top-container
    p.col.col--ds_float.col--ds_4.col--xds_4.section-desc.footer_top-col.footer_top-desc {{ footerDesc }}

    NavCmp(:inHeader='false')

    ContactList(
      classBlock='footer_top-contacts',
      classElemSeparator='_',
      :addClasses='contactClasses'
    )
</template>

<script>
import NavCmp from '@frontCmp/NavCmp';
import ContactList from '@frontCmp/ContactList';

import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('profile');

export default {
  name: 'FooterTop',
  components: {
    NavCmp,
    ContactList,
  },
  data() {
    return {
      contactClasses: {
        col: true,
        'col--tb_float': true,
        'col--tb_6': true,
        'col--ds_3': true,
        'col--xds_4': true,
        'footer_top-col': true,
      },
    };
  },
  computed: {
    ...mapGetters(['footerDesc']),
  },
};
</script>
