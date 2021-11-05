<template>
	<div
		class="scroller"
		@keydown.left="arrowNavigation('prev')"
		@keydown.right="arrowNavigation('next')"
	>
		<div class="scroller__wrapper">
			<div class="scroller__arrows row">
				<transition name="fade">
					<button
						v-if="!isOnStart"
						class="scroller__arrow scroller__arrow--prev svg"
						@click="arrowNavigation('prev')"
					>
						<svg class="svg-icon"><use class="svg-icon-inner" xlink:href="#chevron-large-icon" /></svg>
						<span>Previous</span>
					</button>
				</transition>

				<transition name="fade">
					<button
						v-if="!isOnEnd"
						class="scroller__arrow scroller__arrow--next svg"
						@click="arrowNavigation('next')"
					>
						<span>Next</span>
						<svg class="svg-icon"><use class="svg-icon-inner" xlink:href="#chevron-large-icon" /></svg>
					</button>
				</transition>
			</div>

			<div
				:id="scrollerId"
				ref="scroller"
				class="scroller__main"
			>
				<div
					ref="scroller-row"
					class="scroller__content row"
				>
					<component
						:is="component"
						v-for="(item, index) of items"
						:id="`${scrollerId}-${index}`"
						:key="`element-${index}`"
						:item="item"
						class="scroller__item"
						:class="{
							'is-active': (index === activeItem) || (index > activeItem && index < activeItem + highlightedItems),
							'is-prev': index < activeItem,
							'is-next': index > activeItem + highlightedItems
						}"
						@click.native="moveCarousel(index, 'item')"
					/>

					<div
						v-if="$slots['end']"
						:id="`${scrollerId}-${items.length + 1}`"
						class="scroller__item"
					>
						<slot name="end" />
					</div>
				</div>
			</div>
		</div>

		<div class="scroller__dots">
			<button
				v-for="index in itemCount"
				:key="index"
				:class="{'is-active': activeItem === (index - 1)}"
				@click="moveCarousel(index - 1, 'dot')"
			/>
		</div>
	</div>
</template>

<script>
	import {debounce} from 'lodash-es';

	export default {
		name: 'VueSliderNative',

		props: {
			scrollerId: {
				type: String,
				default: 'scroller'
			},
			items: {
				type: Array,
				required: true
			},
			component: {
				type: Object,
				required: true
			},
			options: {
				type: Object,
				default: () => {
					return {};
				}
				/*
				possibleOptions: {
					moveOnClick: Boolean,
					centerMode: Boolean,
					sticky: Boolean,
					TODO:
					dots
					arrows
				}
				*/
			}
		},

		data() {
			return {
				debouncedHandleHorizontalScroll: null,
				movementOrigin: null,
				activeItem: 0,
				highlightedItems: 0,
				isOnStart: true,
				isOnEnd: false,
				firstMove: true
			};
		},

		computed: {
			itemCount() {
				return this.items.length;
			}
		},

		watch: {
			'$w.resize.width.end': {
				handler() {
					this.setHighlightedItems();
				}
			},
			activeItem() {
				this.$emit('activeItemUpdated', this.activeItem);
			}
		},

		mounted() {
			this.debouncedHandleHorizontalScroll = debounce(this.handleScroll, 50);
			this.$refs.scroller.addEventListener('scroll', this.debouncedHandleHorizontalScroll);
			this.setHighlightedItems();

			const preactivated = this.items.findIndex((item) => item.preactivated);
			if (preactivated && !this.isResponsiveVersion) {
				/*
					another setTimeout, but without anything or even with nextTick or updated() it didn't scroll,
					it just highlighted preactivated item (maybe some problem with vue-scrollto?)
				*/
				setTimeout(() => {
					this.isReady = true;
					this.moveCarousel(preactivated, 'preactivated');
				}, 100);
			}

			this.setHighlightedItems();
		},

		beforeDestroy() {
			this.$refs.scroller.removeEventListener('scroll', this.debouncedHandleHorizontalScroll);
		},

		methods: {
			setHighlightedItems() {
				// switch (this.$w.layout) {
				// 	case 'tiny':
				// 	case 'phone':
				// 		this.highlightedItems = 1;
				// 		break;
				// 	case 'tablet-portrait':
				// 	case 'tablet-landscape':
				// 		this.highlightedItems = 2;
				// 		break;
				// 	case 'desktop':
				// 	case 'desktop-medium':
				// 		this.highlightedItems = 3;
				// 		break;
				// 	default:
				// 		this.highlightedItems = 4;
				// 		break;
				// }
				this.highlightedItems = 1;
			},

			arrowNavigation(direction) {
				if (!this.movementOrigin) {
					const moveTo = direction === 'prev' ? this.activeItem - 1 : this.activeItem + 1;
					this.moveCarousel(moveTo, 'arrows');
				}
			},

			handleScroll() {
				if (!this.movementOrigin && this.$refs['scroller-row']) {
					this.movementOrigin = 'scroll';
					const row = this.$refs['scroller-row'];
					const carouselItems = this.getScrollerHtmlElements();
					let xBoundaries;

					if (this.options.centerMode && !this.isResponsiveVersion) {
						xBoundaries = carouselItems.map((element) => (row.offsetWidth / 2) - (carouselItems[0].offsetWidth / 2) - element.getBoundingClientRect().x);
					} else {
						xBoundaries = carouselItems.map((element) => row.offsetLeft - element.getBoundingClientRect().x);
					}

					const closestValue = xBoundaries.reduce((prev, curr) => (Math.abs(curr) < Math.abs(prev) ? curr : prev));
					const closestIndex = xBoundaries.indexOf(closestValue);

					if (this.options.sticky) {
						this.moveCarousel(closestIndex);
					} else {
						this.activeItem = closestIndex;
					}

					this.handleArrows();

					this.movementOrigin = null;
				}
			},

			moveCarousel(moveTo, origin) {
				if (!this.movementOrigin) {
					console.log('test');
					if (origin === 'item' && !this.options.moveOnClick) {
						return;
					}
					// const direction = moveTo > this.activeItem ? 'right' : 'left';

					this.movementOrigin = origin;
					this.activeItem = moveTo;
					this.activeItem = this.activeItem > this.itemCount ? this.itemCount : this.activeItem;
					this.activeItem = this.activeItem < 0 ? 0 : this.activeItem;

					const element = `#${this.scrollerId}-${this.activeItem}`;

					let offset;

					if (this.$refs['scroller-row']) {
						// TODO: scroll to last element seems to be getting higher value than necessary
						offset = (this.$refs['scroller-row'].offsetLeft * -1) - 20;
					}

					console.log( `#${this.scrollerId}`);

					this.$scrollTo(element, 300, {
						container: `#${this.scrollerId}`,
						easing: 'ease-in',
						duration: 100,
						offset,
						x: true,
						y: false,
						cancelable: false,
						onDone: this.scrollToDone()
					});
				}
			},

			handleArrows() {
				const element = this.$refs.scroller;
				this.isOnStart = element.scrollLeft < 100;
				this.isOnEnd = ((element.scrollWidth - element.scrollLeft) === element.clientWidth) || (this.activeItem - 1) === this.itemCount;
			},

			scrollToDone() {
				/*
					This should be launched only from vue-scrollto/nuxt!
					It needs to be wrapped in timeout because onDone
					from vue-scrollto/nuxt is launching sooner than is really done
				*/
				setTimeout(() => {
					this.handleArrows();
				}, 350);

				// reset movement origin (setTimeout because scrollHandler was launching before arrows navigation was done)
				setTimeout(() => {
					this.movementOrigin = null;
				}, 500);
			},

			getScrollerHtmlElements() {
				return [...this.$refs['scroller-row'].children].filter((child) => child.className.includes('scroller__item'));
			}
		}
	};
</script>

<style scoped lang="scss">
	@import 'assets/mixins';

	.scroller {
		$this: &;

		position: relative;
		overflow: hidden;

		&__wrapper {
			position: relative;
		}

		&__main {
			@include hideScrollbar();
			overflow-x: auto;
			overflow-y: hidden;
		}

		&__content {
			display: flex;
			flex-wrap: nowrap;
			max-width: rem(1200);
			margin: 0 auto;
			padding: 0 rem(15);

			// emulate padding-right for last element in scroller
			&::before,
			&::after {
				display: block;
				flex: 0 0 rem(15);
				height: rem(15);
				content: '';
			}
		}

		&__arrows {
			display: flex;
			justify-content: space-between;
		}

		&__arrow {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			font-size: rem(32);
			font-family: inherit;
			background: none;
			border: 0;
			outline: 0;
			cursor: pointer;
			transition: all $transition-duration-default ease-in-out;

			&--prev {
				margin-right: auto;

				svg {
					margin-right: rem(10);
					transform: scale(-1);
				}
			}

			&--next {
				margin-left: auto;

				svg {
					margin-left: rem(10);
				}
			}

			&:hover,
			&:focus {
				text-shadow: -0.25px -0.25px 0 #262626, 0.25px 0.25px #262626;
			}
		}

		&__dots {
			display: flex;
			justify-content: center;
			margin-top: rem(24);

			button {
				flex: 0 0 rem(8);
				width: rem(8);
				height: rem(8);
				padding: 0;
				background: rgba(black, 0.1);
				border: 0;
				border-radius: 50%;
				outline: 0;
				cursor: pointer;
				transition: background $transition-duration-default ease-in-out;

				& + button {
					margin-left: rem(10);
				}

				&:hover,
				&:focus {
					background: darken(#ddd, 10);
				}

				&.is-active {
					background: black;
				}
			}
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity $transition-duration-default ease-in-out;
	}

	.fast-fade-enter-active,
	.fast-fade-leave-active {
		transition: opacity ($transition-duration-default/2) ease-in-out;
	}
</style>
