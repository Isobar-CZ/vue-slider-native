import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

import {version} from './package.json'

export default {
    input: './src/index.js',
    output: {
        file: 'dist/index.js',
        name: 'vue-slider-native',
        format: 'umd',
		globals: {
			vue: 'vue'
		},
        banner: `/*!
  * vue-slider-native v${version}
  * (c) 2021 Isobar
  * @license ISC
  */`,
    },
	external: ['vue'],
    plugins: [
		vue({
			css: false,
			preprocessStyles: true
		}),
		postcss({
			modules: {
				generateScopedName: '[local]___[hash:base64:5]',
			}
		}),
		resolve(),
        commonjs(),
        babel({
			babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: ['@babel/env'],
            plugins: ['@babel/transform-object-assign']
        })
	],
}
