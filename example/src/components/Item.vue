<template>
	<div class="column">
		<div class="item">
			<img :src="image" :alt="item.title" class="item__image" />

			<div class="item__content">
				<h2 class="item__title">
					{{ item.title }}
				</h2>

				<p class="item__description">
					{{ item.description }}
				</p>
			</div>
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
		},

		computed: {
			image() {
				return require(`@/assets/${this.item.image}`);
			}
		}
	}
</script>

<style scoped lang="scss">
	.item {
		height: 100%;
		background: #f5f5f5;

		&__image {
			display: block;
		}

		&__title {
			margin-top: 0;
		}

		&__content {
			padding: 1em;
		}
	}
</style>
