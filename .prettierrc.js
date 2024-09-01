module.exports = {
  trailingComma: 'none',
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^react$|^react-dom$', '^[.]', '^.'],
  importOrderSeparation: true,
  importOrderParserPlugins: ['jsx', 'classProperties']
}
