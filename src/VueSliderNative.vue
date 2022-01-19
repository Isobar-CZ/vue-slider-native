<template>
	<div
		class="scroller"
		:class="{'scroller--no-overflow': !computedOptions.visibleOverflow}"
		@keydown.left="arrowNavigation('prev')"
		@keydown.right="arrowNavigation('next')"
	>
		<div class="scroller__wrapper">
			<div
				v-if="computedOptions.arrows"
				class="scroller__arrows"
				:style="{maxWidth: computedOptions.containerMaxWidth}"
			>
				<transition name="fade">
					<button
						v-show="!isOnStart"
						class="scroller__arrow scroller__arrow--prev svg"
						@click="arrowNavigation('prev')"
					>
						<template v-if="!$slots['prevArrow']">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15.41 16.58L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.58Z" fill="currentColor" />
							</svg>

							<span>Previous</span>
						</template>

						<slot v-else name="prevArrow" />
					</button>
				</transition>

				<transition name="fade">
					<button
						v-show="!isOnEnd"
						class="scroller__arrow scroller__arrow--next svg"
						@click="arrowNavigation('next')"
					>
						<template v-if="!$slots['nextArrow']">
							<span>Next</span>

							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.58984 16.58L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.58Z" fill="currentColor" />
							</svg>
						</template>

						<slot v-else name="nextArrow" />
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
					class="scroller__content"
					:style="{maxWidth: computedOptions.containerMaxWidth}"
				>
					<component
						:is="component"
						v-for="(item, index) of items"
						:id="`${scrollerId}-${index}`"
						:key="`element-${index}`"
						:item="item"
						class="scroller__item"
						:class="{
							'is-active': (index === activeItem) || (index > activeItem && index < activeItem + computedOptions.highlightItems),
							'is-prev': index < activeItem,
							'is-next': index >= activeItem + computedOptions.highlightItems
						}"
						@click.native="moveCarousel(index, 'item')"
						@item-clicked="handleItemClick(index, $event)"
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

		<div v-if="computedOptions.dots" class="scroller__dots">
			<button
				v-for="index in Math.ceil(itemCount / computedOptions.itemsToScroll)"
				:key="index"
				:class="{'is-active': isDotActive(index)}"
				@click="moveCarousel((index - 1) * computedOptions.itemsToScroll, 'dot')"
			/>
		</div>
	</div>
</template>

<script>
	// eslint-disable-next-line
	import Vue from 'vue';
	import VueScrollTo from 'vue-scrollto';
	import {debounce} from 'lodash-es';

	Vue.use(VueScrollTo);

	const defaultOptions = {
		containerMaxWidth: '1200px',
		duration: 250,
		visibleOverflow: true,
		moveOnClick: true,
		centerMode: false,
		sticky: false,
		dots: false,
		arrows: true,
		highlightItems: 1,
		itemsToScroll: 1,
		preactivatedItem: null,
		responsive: null
	};

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
				default: () => {}
			}
		},

		data() {
			return {
				debouncedHandleHorizontalScroll: null,
				movementOrigin: null,
				activeItem: this.options.preactivatedItem ? this.options.preactivatedItem : 0,
				isOnStart: true,
				isOnEnd: false,
				firstMove: true,
				windowWidth: 0
			};
		},

		computed: {
			computedOptions() {
				if (this.optionsBreakpoint && this.options.responsive) {
					return {
						...defaultOptions,
						...this.options.responsive[`${this.optionsBreakpoint}px`]
					}
				}

				return {
					...defaultOptions,
					...this.options
				};
			},

			itemCount() {
				return this.items.length;
			},

			optionsBreakpoint() {
				if (this.options.responsive) {
					const breakpoints = Object.keys(this.options.responsive);

					let closest = [];
					breakpoints.some((breakpoint) => {
						if (parseInt(breakpoint, 10) >= this.windowWidth) {
							closest.push(parseInt(breakpoint, 10));
						}
					});

					closest = Math.min(...closest);

					return closest === Infinity ? null : closest;
				}
				return null;
			}
		},

		watch: {
			activeItem() {
				this.$emit('activeItemUpdated', this.activeItem);
			}
		},

		mounted() {
			this.windowWidth = document.documentElement.clientWidth;
			this.debouncedHandleHorizontalScroll = debounce(this.handleScroll, 50);
			this.$refs.scroller.addEventListener('scroll', this.debouncedHandleHorizontalScroll);

			const preactivated = this.options.preactivatedItem;
			if (preactivated) {
				/*
					another setTimeout, but without anything or even with nextTick or updated() it didn't scroll,
					it just highlighted preactivated item (maybe some problem with vue-scrollto?)
				*/
				setTimeout(() => {
					this.moveCarousel(preactivated, 'preactivated', 0);
				}, 100);
			}

			window.addEventListener('resize', this.storeWindowWidth);
		},

		beforeDestroy() {
			this.$refs.scroller.removeEventListener('scroll', this.debouncedHandleHorizontalScroll);
			window.removeEventListener('resize', this.storeWindowWidth);
		},

		methods: {
			arrowNavigation(direction) {
				if (!this.movementOrigin) {
					const moveTo = direction === 'prev' ? this.activeItem - this.computedOptions.itemsToScroll : this.activeItem + this.computedOptions.itemsToScroll;
					this.moveCarousel(moveTo, 'arrows');
				}
			},

			handleScroll() {
				if (!this.movementOrigin && this.$refs['scroller-row']) {
					let xBoundaries;

					this.movementOrigin = 'scroll';
					const carouselItems = this.getScrollerHtmlElements();
					const itemWidth = carouselItems[0].offsetWidth;
					const allItemsWidth = carouselItems.length * itemWidth;
					const row = this.$refs['scroller-row'];

					if (this.computedOptions.centerMode) {
						xBoundaries = carouselItems.map((element) => (row.offsetWidth / 2) - (itemWidth / 2) - element.getBoundingClientRect().x);
					} else {
						xBoundaries = carouselItems.map((element) => row.offsetLeft - element.getBoundingClientRect().x);
					}

					const closestValue = xBoundaries.reduce((prev, curr) => (Math.abs(curr) < Math.abs(prev) ? curr : prev));
					const closestIndex = xBoundaries.indexOf(closestValue);

					if (this.computedOptions.sticky) {
						this.movementOrigin = null;
						this.moveCarousel(closestIndex, 'sticky');
					} else {
						this.activeItem = closestIndex;
					}

					this.handleArrows();

					setTimeout(() => {
						this.movementOrigin = null;
					}, 500);
				}
			},

			moveCarousel(moveTo, origin) {
				if (!this.movementOrigin) {
					if (moveTo > this.items.length - 1) {
						moveTo = this.items.length - 1;
					} else if (moveTo < 0) {
						moveTo = 0;
					}

					if (origin === 'item' && !this.moveOnClick) {
						return;
					}
					// const direction = moveTo > this.activeItem ? 'right' : 'left';

					this.movementOrigin = origin;
					this.activeItem = moveTo;
					this.activeItem = this.activeItem > this.itemCount ? this.itemCount : this.activeItem;
					this.activeItem = this.activeItem < 0 ? 0 : this.activeItem;

					const element = `#${this.scrollerId}-${this.activeItem}`;

					let offset;

					if (this.options.centerMode) {
						const halfItemWidth = this.getScrollerHtmlElements()[0].offsetWidth / 2;
						offset = (this.$refs.scroller.offsetWidth / 2) * -1 + halfItemWidth;
					} else if (this.$refs['scroller-row']) {
						offset = (this.$refs['scroller-row'].offsetLeft * -1);
					}

					this.$scrollTo(element, this.computedOptions.duration, {
						container: `#${this.scrollerId}`,
						easing: 'ease-in',
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
			},

			storeWindowWidth() {
				this.windowWidth = document.documentElement.clientWidth;
			},

			isDotActive(index) {
				const minCount = (index - 1) * this.computedOptions.itemsToScroll;
				const maxCount = (index - 1) * this.computedOptions.itemsToScroll + this.computedOptions.itemsToScroll;
				return this.activeItem >= minCount && this.activeItem < maxCount;
			},

			handleItemClick(itemIndex, itemData) {
				this.$emit('item-clicked', {
					itemIndex,
					itemData
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	@import 'assets/mixins';

	.scroller {
		$this: &;

		position: relative;
		max-width: 100%;
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
			margin: 0 auto;
		}

		&__arrows {
			display: flex;
			justify-content: space-between;
			margin: auto;
		}

		&__arrow {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0;
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
				color: $color-active;
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
					background: rgba($color-active, 0.5);
				}

				&.is-active {
					background: $color-active;
				}
			}
		}

		&--no-overflow {
			#{$this}__content {
				overflow: hidden;
			}
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity $transition-duration-default ease-in-out;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
</style>
