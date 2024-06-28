<script setup lang="ts"></script>

<template>
	<div id="app">
		<!-- <header>
			<nav>
				<router-link to="/">Home</router-link>
				<router-link to="/login">Login</router-link>
				<router-link to="/register">Register</router-link>
			</nav>
		</header> -->
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

header {
	background-color: $primary;
	padding: 1rem;
	color: $white;

	nav {
		display: flex;
		gap: 1rem;
	}

	a {
		color: $white;
		&:hover {
			color: $hoverPrimary;
		}
	}
}
</style>
