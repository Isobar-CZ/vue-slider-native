<template>
	<div>
		<VueSliderNative
			scroller-id="scroller"
			:component="AppItem"
			:items="items"
			:options="{
				moveOnClick: true
			}"
		/>
	</div>
</template>

<script>
	import VueSliderNative from './../src/index.vue';
	import AppItem from './Item.vue';

	export default {
		components: {
			VueSliderNative
		},

		data() {
			return {
				AppItem,
				items: [
					{title: 'Test #1'},
					{title: 'Test #2'},
					{title: 'Test #3'},
					{title: 'Test #4'},
					{title: 'Test #5'},
				]
			};
		}
	};
</script>
