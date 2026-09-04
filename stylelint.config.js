export default {
  extends: ['stylelint-config-standard-vue/scss'],
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
    },
  ],
}
