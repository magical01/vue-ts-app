<script setup lang="ts"></script>

<template>
	<div id="app">
		<main>
			<router-view />
		</main>
	</div>
</template>

<style scoped lang="scss">
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
