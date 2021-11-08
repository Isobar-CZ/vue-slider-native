module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	plugins: [],
	parserOptions: {
		parser: '@babel/eslint-parser'
	},
	extends: [
		"airbnb-base",
		"plugin:vue/recommended"
	],
	// add your custom rules here
	rules: {
		// nuxt
		"nuxt/no-cjs-in-config": "off",
		"semi": ["warn", "always"],

		// own for ES6
		"comma-dangle": "off",
		"quotes": ["warn", "single", {
			avoidEscape: true,
			allowTemplateLiterals: true
		}],
		"no-undef": "off",
		"no-console": "off",
		"no-case-declarations": "off",
		"no-unused-vars": "off",
		"semi-style": "off",
		"no-tabs": "off",
		"no-underscore-dangle": "off",
		"indent": ["error", "tab", {"SwitchCase": 1}],
		"spaced-comment": "off",
		"object-curly-newline": "off",
		"object-curly-spacing": ["warn", "never"],
		"no-multi-assign": "off",
		"no-plusplus": "off",
		"no-param-reassign": "off",
		"no-use-before-define": "off",
		"implicit-arrow-linebreak": "off",
		"class-methods-use-this": "off",
		"no-nested-ternary": "off",
		"arrow-parens": ["warn", "always"],
		"max-len": "off",
		"no-prototype-builtins": "off",
		"linebreak-style": "off",
		"operator-linebreak": ["warn", "before"],
		"no-unmodified-loop-condition": "off",
		"space-before-function-paren": ["warn", {
			"anonymous": "always",
			"named": "never",
			"asyncArrow": "always"
		}],

		// *.vue files
		// allow v-html, we need it for proper SSR
		"vue/no-v-html": "off",
		// base indent at <script> tag
		"vue/script-indent": ["warn", "tab", {
			"baseIndent": 1,
			"switchCase": 1
		}],
		// attributes per line indent setting
		"vue/html-indent": ["warn", "tab", {
			"attribute": 1,
			"baseIndent": 1,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": []
		}],
		// freedom, becouse sometime we want (need) attributes in single line (design attributes or analytics, ...)
		"vue/max-attributes-per-line": ["warn", {
			"singleline": 99,
			"multiline": {
				"max": 1,
				"allowFirstLine": false
			}
		}],
		// allow <v-button>CTA</v-button>
		"vue/singleline-html-element-content-newline": "off",
		// <br /> :)
		"vue/html-self-closing": ["warn", {
			"html": {
				"void": "always"
			}
		}],
		"import/extensions": ["error", "never"]
	},
	overrides: [
		{
			"files": ["*.vue"],
			"rules": {
				"indent": "off"
			}
		}
	],
}
