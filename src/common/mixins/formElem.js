import types from "../constants/validation/types";

export default {
  props: {
    val: {
      type: Object,
      required: true
    },
    value: {
      // type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    legend: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      classes: {
        block: "form",
        elem: "input",
        modifs: {
          required: "required",
          error: "error",
          valid: "valid"
        }
      }
    };
  },
  computed: {
    state: {
      get() {
        return this.value;
      },
      set(value) {
        let eventType;

        switch (this.type) {
          case "checkbox":
            eventType = "change";
            break;
          default:
            eventType = "input";
        }

        this.val.$touch();
        this.$emit(eventType, value);
      }
    },
    getType() {
      return this.type;
    },
    isEmptyRequired() {
      return this.val.$error && !this.state;
    },
    errorType() {
      if (this.isEmptyRequired) {
        return "required";
      }

      if (this.val.$error) {
        return this.type;
      }

      return "";
    },
    validationClasses() {
      const baseClass = `${this.classes.block}__${this.classes.elem}-`;

      return {
        [baseClass + this.classes.modifs.error]: this.val.$error,
        [baseClass + this.classes.modifs.valid]: !this.val.$invalid
      };
    }
  }
};
