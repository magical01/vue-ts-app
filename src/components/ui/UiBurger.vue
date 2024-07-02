<script setup lang="ts">
import { defineEmits } from 'vue'

import SvgBurger from '../svg/SvgBurger.vue'

/**
 * Компонент бургер-кнопки.
 *
 * @emits click - Событие клика на кнопку.
 */
const emit = defineEmits(['click'])
</script>

<template>
	<button class="ui-burger" @click="$emit('click', $event)">
		<SvgBurger />
	</button>
</template>

<style lang="scss" scoped>
.ui-burger {
	display: none;
	position: absolute;
	top: 12px;
	right: 16px;
	background-color: transparent;
	border: none;
	width: 24px;
	height: 24px;
	z-index: 100;

	@include mobile {
		display: inline-block;
	}
}
</style>
