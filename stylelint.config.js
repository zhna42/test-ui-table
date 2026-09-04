export default {
  extends: ['stylelint-config-standard-vue/scss'],
  rules: {
    'selector-class-pattern': '^[a-z][a-z0-9]*(?:[_-]{1,2}[a-z0-9]+)*$',
  },
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
    },
  ],
}
