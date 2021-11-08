<template>
	<div
		class="scroller"
		@keydown.left="arrowNavigation('prev')"
		@keydown.right="arrowNavigation('next')"
	>
		<div class="scroller__wrapper">
			<div v-if="computedOptions.arrows" class="scroller__arrows row">
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
						<template v-if="!$slots['prevArrow']">
							<span>Next</span>

							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M8.58984 16.58L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.58Z" fill="currentColor" />
							</svg>
						</template>

						<slot v-else name="prevArrow" />
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
							'is-active': (index === activeItem) || (index > activeItem && index < activeItem + computedOptions.highlightItems),
							'is-prev': index < activeItem,
							'is-next': index > activeItem + computedOptions.highlightItems
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

		<div v-if="computedOptions.dots" class="scroller__dots">
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
	// eslint-disable-next-line
	import Vue from 'vue';
	import VueScrollTo from 'vue-scrollto';
	import {debounce} from 'lodash-es';

	Vue.use(VueScrollTo);

	const defaultOptions = {
		moveOnClick: true,
		centerMode: false,
		sticky: false,
		dots: false,
		arrows: true,
		highlightItems: 1,
		preactivatedItem: null
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
				firstMove: true
			};
		},

		computed: {
			computedOptions() {
				return {
					...defaultOptions,
					...this.options
				};
			},
			itemCount() {
				return this.items.length;
			}
		},

		watch: {
			activeItem() {
				this.$emit('activeItemUpdated', this.activeItem);
			}
		},

		mounted() {
			this.debouncedHandleHorizontalScroll = debounce(this.handleScroll, 50);
			this.$refs.scroller.addEventListener('scroll', this.debouncedHandleHorizontalScroll);

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
		},

		beforeDestroy() {
			this.$refs.scroller.removeEventListener('scroll', this.debouncedHandleHorizontalScroll);
		},

		methods: {
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

					if (this.computedOptions.centerMode && !this.isResponsiveVersion) {
						xBoundaries = carouselItems.map((element) => (row.offsetWidth / 2) - (carouselItems[0].offsetWidth / 2) - element.getBoundingClientRect().x);
					} else {
						xBoundaries = carouselItems.map((element) => row.offsetLeft - element.getBoundingClientRect().x);
					}

					const closestValue = xBoundaries.reduce((prev, curr) => (Math.abs(curr) < Math.abs(prev) ? curr : prev));
					const closestIndex = xBoundaries.indexOf(closestValue);

					if (this.computedOptions.sticky) {
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
					if (origin === 'item' && !this.computedOptions.moveOnClick) {
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

			// emulate padding-right for last element in scroller
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
