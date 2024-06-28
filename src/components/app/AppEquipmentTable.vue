<script setup lang="ts">
import { ref } from 'vue'

interface Equipment {
	name: string
	details: string
}

const equipmentList = ref<Equipment[]>([
	{ name: 'Equipment 1', details: 'Details of Equipment 1' },
	{ name: 'Equipment 2', details: 'Details of Equipment 2' }
])
</script>

<template>
	<div class="equipment-table">
		<h2>Equipment Table</h2>
		<table>
			<thead>
				<tr>
					<th>Equipment</th>
					<th>Details</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(equipment, index) in equipmentList" :key="index">
					<td>{{ equipment.name }}</td>
					<td>{{ equipment.details }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style scoped lang="scss">
.equipment-table {
	table {
		width: 100%;
		border-collapse: collapse;
		th,
		td {
			border: 1px solid $black;
			padding: 0.5rem;
		}
	}
}
</style>
