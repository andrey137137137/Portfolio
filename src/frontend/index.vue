<template lang="pug">
Fragment
  PageWrapper
    HeaderWrapper
      a.btn.btn--opacity.authorization(
        :href='authBtnlink',
        ref='flipBtn',
        @click='fadeButton'
      ) {{ authBtnTitle }}
      .container.header-container.header-container--framed(
        :class='flippedClass'
      )
        .header-flip_wrap
          HeaderContent
          NavCmp
        FrontFormWrapper#login_form.header-flip_wrap.header-flip_wrap--back.login_form(
          action='/admin',
          @submit.prevent.native='handleSubmit'
        )
          .login_form-top_wrap
            h2.section-title.section-title--uppercase.login_form-title Авторизуйтесь

            InputEventElem(
              wrapClass='icon_label',
              ref='username',
              name='username',
              labelIcon='login',
              label='Пользователь',
              v-model='username',
              :val='$v.username',
              placeholder='Пользователь'
            )

            InputEventElem(
              wrapClass='icon_label',
              ref='password',
              name='password',
              labelIcon='password',
              label='Пароль',
              v-model='password',
              :val='$v.password',
              type='password',
              placeholder='Пароль'
            )

            ChangeEventElem(
              label='Я человек',
              ref='isHuman',
              name='isHuman',
              v-model='isHuman',
              :val='$v.isHuman',
              type='checkbox'
            )

            legend.form-legend Вы точно не робот?

            .form-wrap.form-wrap--radio.login_form-radio_wrap
              .form-row.flex.flex--wrap
                label.form-label.login_form-radio_yes
                  input.form-input(
                    type='radio',
                    value='yes',
                    v-model='$v.notRobot.$model'
                  )
                  .form-checked
                  .form-checkbox_text Да
                label.form-label
                  input.form-input(
                    type='radio',
                    value='no',
                    v-model='$v.notRobot.$model'
                  )
                  .form-checked
                  .form-checkbox_text Не уверен

            ErrorElem(:message='formError', :styleTop='errorStyleTop')

          .menu.header-menu.header-menu--float.form-menu.login_form-menu
            a#flip_2_front.menu-link.btn(@click.prevent='fadeButton', href='#') На главную
            input.menu-link.btn(type='submit', value='Войти')
    SubmitMessage
  FooterWrapper
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import { Fragment } from 'vue-fragment';
import { ERROR } from '@httpSt';
import { ADMIN } from '@common/constants/router';
// import { required } from "vuelidate/lib/validators";
import { userAlphaNumValids, checked } from '@common/helpers';
import frontFormMixin from '@frontend/mixins/frontFormMixin';
import getAuthStatusMixin from '@frontend/mixins/getAuthStatusMixin';
import PageWrapper from '@frontCmp/PageWrapper';
import HeaderWrapper from '@frontCmp/header/HeaderWrapper';
import HeaderContent from '@frontCmp/header/HeaderContent';
import NavCmp from '@frontCmp/NavCmp';
import FrontFormWrapper from '@frontCmp/FrontFormWrapper';
import ErrorElem from '@components/formElems/ErrorElem';
import InputEventElem from '@components/formElems/InputEventElem';
import ChangeEventElem from '@components/formElems/ChangeEventElem';
import SubmitMessage from '@components/formElems/SubmitMessage';
import FooterWrapper from '@frontCmp/FooterWrapper';

import { mapActions } from 'vuex';

export default {
  name: 'Home',
  components: {
    Fragment,
    PageWrapper,
    HeaderWrapper,
    HeaderContent,
    NavCmp,
    FrontFormWrapper,
    ErrorElem,
    InputEventElem,
    ChangeEventElem,
    SubmitMessage,
    FooterWrapper,
  },
  mixins: [frontFormMixin, getAuthStatusMixin],
  data() {
    return {
      isFlipped: false,
      username: '',
      password: '',
      isHuman: false,
      notRobot: '',
    };
  },
  validations: {
    username: userAlphaNumValids,
    password: userAlphaNumValids,
    isHuman: {
      checked,
    },
    notRobot: {
      // required
    },
  },
  computed: {
    authBtnlink() {
      return this.isAuth ? 'admin' : '#login';
    },
    authBtnTitle() {
      return this.isAuth ? 'Администрировать' : 'Авторизоваться';
    },
    flippedClass() {
      return { 'header-container--flipped': this.isFlipped };
    },
  },
  methods: {
    ...mapActions(['setAuthStatus', 'setFormMessage']),
    fadeButton(e) {
      if (this.isAuth) return;

      e.preventDefault();

      const $flipBtn = $(this.$refs.flipBtn);
      this.isFlipped = !this.isFlipped;
      $flipBtn[this.isFlipped ? 'fadeOut' : 'fadeIn']();
    },
    handleSubmit() {
      if (!this.touchInvalidElem()) return false;

      const $vm = this;
      const { username, password } = $vm;

      axios
        .post('user/auth', { username, password })
        .then(res => {
          if (res.data.success) {
            $vm.setAuthStatus(res.data.success);
            return $vm.$router.push(ADMIN);
          }

          return false;
        })
        .catch(err => {
          if (!err.response) {
            $vm.setFormMessage({ status: ERROR, message: '' });
            return;
          }

          const status = err.response.status;
          const message = err.response.data.message;
          $vm.setFormMessage({ status, message });
        });
    },
  },
};
</script>

<style lang="scss">
@import '@frontStylesPgs/Home/import';
@import '@frontStylesCmp/LoginForm/import';
</style>
