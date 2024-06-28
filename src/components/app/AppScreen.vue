<script setup lang="ts"></script>

<template>
	<div class="screen">
		<div class="screen__left">
			<h1 class="screen__left-title">VUE APP</h1>
		</div>
		<div class="screen__right">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.screen {
	display: flex;
	height: 100dvh;

	&__left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 50%;
		background-color: $primary;
	}

	&__left-title {
		font-weight: 700;
		font-size: 78px;
		color: $white;
	}

	&__right {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 50%;
		background-color: $background;
	}
}
</style>
