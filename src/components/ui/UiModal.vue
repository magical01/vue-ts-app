<script lang="ts" setup>
defineEmits<{
	(e: 'close'): void
}>()
</script>

<template>
	<div class="modal-overlay" @click="$emit('close')">
		<div class="modal" @click.stop>
			<header class="modal__header">
				<slot name="header"></slot>
				<button @click="$emit('close')">&times;</button>
			</header>
			<div class="modal__body">
				<slot name="body"></slot>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba($black, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 3000;
}

.modal {
	background-color: $white;
	padding: 20px;
	border-radius: 5px;
	width: 80%;
	max-width: 500px;

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;

		button {
			background: none;
			border: none;
			font-size: 24px;
			cursor: pointer;
		}
	}
}
</style>
