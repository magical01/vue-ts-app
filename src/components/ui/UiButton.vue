<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

/**
 * Компонент кнопки.
 *
 * @prop {string} type - Тип кнопки (button или submit).
 * @emits click - Событие клика на кнопку.
 */
defineProps({
	type: {
		type: String as () => 'button' | 'submit',
		default: 'button' as const
	}
})

const emit = defineEmits(['click'])
</script>

<template>
	<button class="ui-button" :type="type" @click="$emit('click', $event)">
		<slot></slot>
	</button>
</template>

<style lang="scss" scoped>
.ui-button {
	border-radius: 10px;
	padding: 16px 24px;
	font-weight: 600;
	font-size: 14px;
	line-height: 1;
	background-color: $primary;
	cursor: pointer;
	border: none;
	color: $white;
	transition: $transition;

	@include hover {
		&:hover {
			background-color: $accent;
		}
	}

	@include mobile {
		padding: 12px 20px;
	}
}
</style>
