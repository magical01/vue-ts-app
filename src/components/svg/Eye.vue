<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
	width: {
		type: Number,
		default: 24
	},
	height: {
		type: Number,
		default: 24
	},
	iconColor: {
		type: [String, Number],
		default: '#A9ACB3'
	}
})
</script>

<template>
	<svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M20.1881 10.9343C20.7045 11.5613 20.7045 12.4387 20.1881 13.0657C18.768 14.7899 15.6358 18 12.0001 18C8.36432 18 5.23211 14.7899 3.81202 13.0657C3.29557 12.4387 3.29557 11.5613 3.81202 10.9343C5.23211 9.21014 8.36432 6 12.0001 6C15.6358 6 18.768 9.21014 20.1881 10.9343Z"
			stroke="#A9ACB3"
			stroke-width="2"
		/>
		<path
			d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
			stroke="#A9ACB3"
			stroke-width="2"
		/>
	</svg>
</template>

<style lang="scss" scoped></style>
