# vue-slider-native
Let your visitors scroll freely through your products or other items with native scroll.
No translateX and emulating native behavior of scrolling. With support of dots and arrows.

## Demo
See examples of usage and docs [here](https://isobar-cz.github.io/vue-slider-native/).

## Usage
In template
```html
<vue-slider-native
    scroller-id="scroller" 
    :component="AppItem" 
    :items="items"
    :options="options"
/>
```
In JS
```js
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
}
```
## Options

| Option                     	| Default 	| Description                                                                                                                                         	|
|----------------------------	|---------	|-----------------------------------------------------------------------------------------------------------------------------------------------------	|
| moveOnClick<br>_boolean_     	| true    	| Define whether the click on one item should become highlighted and move to active position.                                                         	|
| centerMode<br>_boolean_      	| false   	| When turned on, active item will be centered. Best to be combined together with preactivatedItem option to create e.g. nice native scroll timeline. 	|
| sticky<br>_boolean_          	| false   	| Scroll to closest active item after user finished scrolling horizontally using touchpad on horizontal mouse wheel.                                  	|
| dots<br>_boolean_            	| false   	| Shows/hides dots. Better to use only if items are wide enough.                                                                                      	|
| arrows<br>_boolean_          	| true    	| Shows/hides arrows.                                                                                                                                 	|
| highlightItems<br>_number_   	| 1       	| How many items should be highlighted as active.                                                                                                     	|
| preactivatedItem<br>_number_ 	| null    	| If you don't want to start at the beginning, set index of first item here.                                                                          	|

## Customize arrows
In case you need to change default arrows you can do so with &lt;template v-slot:prevArrow /&gt; and &lt;template v-slot:nextArrow /&gt;
<br>In these slots you can style and change label in any way you want.
```html
<vue-slider-native>
	<template v-slot:prevArrow>
		<div class="custom-arrow">
			custom prev label
		</div>
	</template>
</vue-slider-native>
```

## Callbacks
### activeItemUpdated(activeItem)
If you need to do some action with item that is currently highlighted, you can do so with this callback.
```html
<VueSliderNative @activeItemUpdated="doSomeAction(activeItemIndex)" />
```

## TODOs:
- add vertical mode
- describe responsive mode in README.md
- fine-tune center mode 
