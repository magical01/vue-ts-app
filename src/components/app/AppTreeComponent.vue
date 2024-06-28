<script setup lang="ts">
import { ref } from 'vue'

interface Entrance {
	name: string
}

interface House {
	name: string
	entrances: Entrance[]
}

interface Street {
	name: string
	houses: House[]
}

interface District {
	name: string
	streets: Street[]
}

interface City {
	name: string
	districts: District[]
}

const treeData = ref<City[]>([
	{
		name: 'City A',
		districts: [
			{
				name: 'District 1',
				streets: [
					{
						name: 'Street 1',
						houses: [
							{
								name: 'House 1',
								entrances: [{ name: 'Entrance 1' }, { name: 'Entrance 2' }]
							},
							{
								name: 'House 2',
								entrances: [{ name: 'Entrance 1' }]
							}
						]
					},
					{
						name: 'Street 2',
						houses: [
							{
								name: 'House 1',
								entrances: [{ name: 'Entrance 1' }]
							}
						]
					}
				]
			},
			{
				name: 'District 2',
				streets: [
					{
						name: 'Street 1',
						houses: [
							{
								name: 'House 1',
								entrances: [{ name: 'Entrance 1' }]
							}
						]
					}
				]
			}
		]
	}
])
</script>

<template>
	<div class="tree-component">
		<h2>City Structure</h2>
		<ul>
			<li v-for="(city, cityIndex) in treeData" :key="cityIndex">
				{{ city.name }}
				<ul>
					<li v-for="(district, districtIndex) in city.districts" :key="districtIndex">
						{{ district.name }}
						<ul>
							<li v-for="(street, streetIndex) in district.streets" :key="streetIndex">
								{{ street.name }}
								<ul>
									<li v-for="(house, houseIndex) in street.houses" :key="houseIndex">
										{{ house.name }}
										<ul>
											<li v-for="(entrance, entranceIndex) in house.entrances" :key="entranceIndex">
												{{ entrance.name }}
												<!-- Контекстное меню для управления элементами -->
											</li>
										</ul>
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
.tree-component {
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		padding: 0.5rem;
		margin: 0.5rem 0;
		border: 1px solid $black;
		border-radius: 5px;
	}
}
</style>
