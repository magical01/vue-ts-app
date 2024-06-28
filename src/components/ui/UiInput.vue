<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
	modelValue: string
	type?: string
	placeholder?: string
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
}>()

const type = props.type || 'text'
const placeholder = props.placeholder || ''

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	emit('update:modelValue', target.value)
}
</script>

<template>
	<input :type="type" :placeholder="placeholder" :value="modelValue" @input="handleInput" class="ui-input" />
</template>

<style lang="scss" scoped>
.ui-input {
	border: 1px solid $grayElement;
	border-radius: 12px;
	padding: 14px 16px;
	font-weight: 500;
	font-size: 14px;
	background-color: $white;
	transition: $transition;

	@media (any-hover: hover) {
		&:hover {
			border-color: $primary;
		}
	}
}
</style>
