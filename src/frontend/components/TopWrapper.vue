<script>
import { WORKS, BLOG } from '@common/constants/router';
import TitleWrapper from '@frontCmp/TitleWrapper';

export default {
  name: 'TopWrapper',
  render(h) {
    const wrapperElem = this.isWorks ? 'section' : 'div';
    const elems = [this.cornerBorderElem()];

    if (this.isWorks) {
      elems.push(this.titleWrapperElem());
    }

    elems.push(this.$slots.default);

    return h(wrapperElem, { class: ['section', 'top_wrap'] }, elems);
  },
  computed: {
    isWorks() {
      return this.$route.name == WORKS;
    },
    cornerBorderClasses() {
      const name = this.$route.name;
      return {
        'top_wrap-corner_border': true,
        'top_wrap-corner_border--half_opacity': this.isWorks,
        'top_wrap-corner_border--two_colors': !this.isWorks && name != BLOG,
        'top_wrap-corner_border--beige': !this.isWorks && name == BLOG,
      };
    },
  },
  methods: {
    cornerBorderElem() {
      return <div id="cornerBorder" class={this.cornerBorderClasses} />;
    },
    titleWrapperElem() {
      return (
        <TitleWrapper
          title={this.$route.meta.title}
          containerAddClass="top_wrap-title_wrap"
        />
      );
    },
  },
};
</script>

<style lang="scss">
@import '@frontStylesCmp/TopWrapper/import';
</style>
