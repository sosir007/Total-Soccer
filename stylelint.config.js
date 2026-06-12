export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html/vue',
    'stylelint-config-recommended-vue',
    'stylelint-config-recess-order'
  ],
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.pnpm-store/**',
    'docs/ui-mockups/**'
  ],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'no-descending-specificity': null,
    'font-family-name-quotes': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    'color-hex-length': null,
    'media-feature-range-notation': null,
    'order/properties-order': null
  }
};
