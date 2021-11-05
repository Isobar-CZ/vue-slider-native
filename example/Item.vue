<template>
	<div class="column">
		<div class="item">
			{{ item.title }}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				required: true
			}
		}
	}
</script>

<style scoped lang="scss">
	.column {
		flex: 0 0 25%;
		padding: 0 15px;
	}

	.item {
		height: 200px;
		padding: 1em;
		font: 16px Arial;
		border: 2px solid #ddd;
	}
</style>
