module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended'
	],
	plugins: [
		'vue',
		'@typescript-eslint'
	],
	parserOptions: {
		ecmaVersion: 2020,
		parser: '@typescript-eslint/parser'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		indent: [1, "tab", {
			SwitchCase: 1
		}],
		"vue/html-indent": [1, "tab"],
		"vue/script-indent": [1, "tab", {
			"baseIndent": 0,
			"switchCase": 1,
			"ignores": []
		}],
		semi: ["warn", "always"],

		"object-curly-spacing": ["error", "always"],
		// "array-bracket-spacing": ["error", "always"],
		// "computed-property-spacing": ["error", "always"]
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)'
			],
			env: {
				jest: true
			}
		}
	]
};
