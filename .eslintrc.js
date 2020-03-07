module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		'ecmaVersion': 7,
		'sourceType': 'module',
		'ecmaFeatures': {
			'jsx': true,
		},
	},
	extends: 'airbnb',
	plugins: [
		'react',
		'import',
		'react-hooks',
	],
	rules: {
		'semi': ['error', 'never'],
		'global-require': 'off',
		'jsx-quotes': ['error', 'prefer-single'],
		'prefer-const': 'error',
		'import/no-unresolved': 'off',
		'react/jsx-one-expression-per-line': 'off',
		'react/forbid-prop-types': 'off',
		'no-script-url': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'camelcase': 'off', // 后端传的字段都是 camelcase
		'no-nested-ternary': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
		'jsx-a11y/label-has-associated-control': ['error', {
			'required': {
				'some': ['nesting', 'id'],
			},
		}],
		'jsx-a11y/label-has-for': ['error', {
			'required': {
				'some': ['nesting', 'id'],
			},
		}],
		'space-before-function-paren': ['error', 'never'],
	},
	env: {
		browser: true,
		node: true,
		jest: true,
	},
}
