<template>
	<div>
		<div class="row">
			<div class="column">
				<h1>vue-slider-native</h1>

				<p>
					Let your visitors scroll freely through your products or other items with native scroll.
					No translateX and emulating native behavior of scrolling. With support of dots and arrows.
				</p>
			</div>
		</div>

		<div class="scroller">
			<VueSliderNative
				scroller-id="scroller"
				:component="AppItem"
				:items="items"
				:options="{
					moveOnClick: true
				}"
			/>
		</div>

		<div class="row">
			<div class="column">
				<h2>Usage</h2>
				<vue-code-highlight language="html">
					<pre>
&lt;vue-slider-native
	scroller-id="scroller"
	:component="AppItem"
	:items="items"
	:options="options"
/&gt;</pre>
				</vue-code-highlight>
				<vue-code-highlight language="javascript">
					<pre>
import VueSliderNative from 'VueSliderNative';
import AppItem from '@/components/Item'; // any component you want to loop

export default {
	components: {
		VueSliderNative
	},
	data() {
		return {
			AppItem,
			items: [], // array of your items
			options: { // see all possible options below
				arrows: true
			}
		};
	}
}</pre>
				</vue-code-highlight>
			</div>
		</div>

		<div class="row">
			<div class="column">
				<h2>Options</h2>

				<table>
					<thead>
						<tr>
							<th>Option</th>
							<th>Description</th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="(possibleOption, index) in possibleOptions" :key="index">
							<td>
								<strong>{{ possibleOption.name }}</strong><br />
								Type: <em>{{ possibleOption.type }}</em><br />
								<em>(default: {{ possibleOption.default }})</em>
							</td>
							<td>
								{{ possibleOption.description }}
							</td>
						</tr>
					</tbody>

				</table>
			</div>
		</div>

		<div class="row">
			<div class="column">
				<h2>Callbacks</h2>
				<p>TODO: describe activeItemUpdated(activeItem)</p>
			</div>
		</div>

		<div class="row">
			<div class="column">
				<h2>TODO: examples of useful combinations of options</h2>
			</div>
		</div>
	</div>
</template>

<script>
	// eslint-disable-next-line
	import VueSliderNative from './../../src/index.vue';
	import AppItem from './components/Item.vue';
	import VueCodeHighlight from 'vue-code-highlight/src/CodeHighlight.vue';
	import 'vue-code-highlight/themes/duotone-sea.css';

	export default {
		components: {
			VueSliderNative,
			VueCodeHighlight
		},

		data() {
			return {
				AppItem,

				items: [
					{
						image: '1.jpg',
						title: 'Daft Punk',
						description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam in lorem sit amet leo accumsan lacinia. Pellentesque ipsum.'
					},
					{
						image: '2.jpg',
						title: 'Justice',
						description: 'Integer malesuada. Nulla pulvinar eleifend sem. Pellentesque habitant morbi tristique senectus et netus et malesuada.'
					},
					{
						image: '3.jpg',
						title: 'French 79',
						description: 'Sed ac dolor sit amet purus malesuada congue. Quisque tincidunt scelerisque libero. Donec quis nibh at felis congue commodo.'
					},
					{
						image: '4.jpg',
						title: 'Jean-Michel Jarre',
						description: 'Cras elementum. Phasellus rhoncus. Nulla est. Etiam egestas wisi a erat. Nulla est. In enim a arcu imperdiet malesuada.'
					},
					{
						image: '5.jpg',
						title: 'Joakim',
						description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.'
					},
					{
						image: '6.jpg',
						title: 'Sébastien Léger',
						description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam in lorem sit amet leo accumsan lacinia. Pellentesque ipsum.'
					},
					{
						image: '7.jpg',
						title: 'Kavinsky',
						description: 'Integer malesuada. Nulla pulvinar eleifend sem. Pellentesque habitant morbi tristique senectus et netus et malesuada.'
					},
					{
						image: '8.jpg',
						title: 'Martin Soilveig',
						description: 'Sed ac dolor sit amet purus malesuada congue. Quisque tincidunt scelerisque libero. Donec quis nibh at felis congue commodo.'
					},
					{
						image: '9.jpg',
						title: 'DJ Mehdi',
						description: 'Cras elementum. Phasellus rhoncus. Nulla est. Etiam egestas wisi a erat. Nulla est. In enim a arcu imperdiet malesuada.'
					},
					{
						image: '10.jpg',
						title: 'Bob Sinclar',
						description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.'
					}
				],

				possibleOptions: [
					{
						name: 'moveOnClick',
						type: 'boolean',
						default: true,
						description: 'Define whether the click on one item should become highlighted and move to active position.'
					},
					{
						name: 'centerMode',
						type: 'boolean',
						default: false,
						description: 'When turned on, active item will be centered. Best to be combined together with preactivatedItem option to create e.g. nice native scroll timeline.'
					},
					{
						name: 'sticky',
						type: 'boolean',
						default: false,
						description: 'Scroll to closest active item after user finished scrolling horizontally using touchpad on horizontal mouse wheel.'
					},
					{
						name: 'dots',
						type: 'boolean',
						default: false,
						description: 'Shows/hides dots. Better to use only if items are wide enough.'
					},
					{
						name: 'arrows',
						type: 'boolean',
						default: true,
						description: 'Shows/hides arrows.'
					},
					{
						name: 'highlightItems',
						type: 'number',
						default: 1,
						description: 'How many items should be highlighted as active.'
					},
					{
						name: 'preactivatedItem',
						type: 'number',
						default: null,
						description: `If you don't want to start at the beginning, set index of first item here.`
					}
				]
			};
		}
	};
</script>

<style lang="scss">
	@import '../../src/assets/mixins';

	body {
		font: 16px/1.4 Arial;
	}

	.row {
		display: flex;
		max-width: rem(1200);
		margin: 0 auto;
		padding: 0 rem(15);
	}

	.column {
		flex: 1;
		padding: 0 15px;
	}

	.scroller .column {
		flex: 0 0 25%;
	}

	table {
		border-collapse: collapse;

		tr:nth-child(odd) {
			td,
			th {
				background: #ddd;
			}
		}
		td,
		th {
			padding: rem(16);
			text-align: left;
			vertical-align: top;
		}
	}
</style>
