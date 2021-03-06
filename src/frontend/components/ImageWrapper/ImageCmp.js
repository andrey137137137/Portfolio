export default {
  name: 'ImageCmp',
  render(h) {
    return this.breakpoint ? this.sourceElem(h) : this.imgElem(h);
  },
  props: {
    path: {
      type: String,
      required: true,
    },
    classes: {
      type: Object,
      required: true,
    },
    isLazyLoading: {
      type: Boolean,
      required: true,
    },
    breakpoint: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVisible: false,
      imgRef: 'img',
      lazyloadThrottleTimeout: 0,
    };
  },
  computed: {
    srcAttr() {
      return this.breakpoint ? 'srcset' : 'src';
    },
    srcAttrs() {
      return this.isLazyLoading
        ? { 'data-src': this.path, [this.srcAttr]: '' }
        : { [this.srcAttr]: this.path };
    },
    lazyClass() {
      return { lazy: this.isLazyLoading };
    },
  },
  methods: {
    sourceElem(h) {
      return h('source', {
        attrs: {
          media: '(min-width: ' + this.breakpoint + 'px)',
          ...this.srcAttrs,
        },
        class: this.lazyClass,
        ref: this.imgRef,
      });
    },
    imgElem(h) {
      return h('img', {
        class: { ...this.classes, ...this.lazyClass },
        attrs: { ...this.srcAttrs, alt: this.title },
        ref: this.imgRef,
      });
    },
    setSrc() {
      const img = this.$refs[this.imgRef];

      img[this.srcAttr] = img.dataset.src;
      img.removeAttribute('data-src');
      this.isVisible = true;
    },
    lazyload() {
      const $vm = this;
      const img = this.$refs[this.imgRef];

      if (this.lazyloadThrottleTimeout) {
        clearTimeout(this.lazyloadThrottleTimeout);
      }

      this.lazyloadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;

        if (img.offsetTop < window.innerHeight + scrollTop) {
          $vm.setSrc();
        }

        if ($vm.isVisible) {
          document.removeEventListener('scroll', $vm.lazyload);
          window.removeEventListener('resize', $vm.lazyload);
          window.removeEventListener('orientationChange', $vm.lazyload);
        }
      }, 20);
    },
  },
  mounted() {
    if (this.isLazyLoading) {
      const img = this.$refs[this.imgRef];

      if ('IntersectionObserver' in window) {
        const $vm = this;
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const image = entry.target;
              $vm.setSrc();
              imageObserver.unobserve(image);
            }
          });
        });

        imageObserver.observe(img);
      } else {
        document.addEventListener('scroll', this.lazyload);
        window.addEventListener('resize', this.lazyload);
        window.addEventListener('orientationChange', this.lazyload);
      }
    }
  },
};
