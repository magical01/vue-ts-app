<script lang="ts" setup>
import { computed } from 'vue'

/**
 * Компонент контекстного меню.
 *
 * @prop {Object} position - Позиция меню.
 * @prop {number} position.x - Координата X.
 * @prop {number} position.y - Координата Y.
 * @prop {Array} actions - Список действий меню.
 * @prop {string} actions[].label - Метка действия.
 * @prop {string} actions[].action - Идентификатор действия.
 * @emits select - Событие выбора действия.
 */
const props = defineProps<{
	position: { x: number; y: number }
	actions: Array<{ label: string; action: string }>
}>()

const emit = defineEmits<{
	(e: 'select', action: string): void
}>()

const menuStyle = computed(() => ({
	top: `${props.position.y}px`,
	left: `${props.position.x}px`
}))

function selectAction(action: string) {
	emit('select', action)
}
</script>

<template>
	<div class="context-menu" :style="menuStyle">
		<ul>
			<li v-for="action in actions" :key="action.action" @click="selectAction(action.action)">
				{{ action.label }}
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.context-menu {
	position: fixed;
	background: $white;
	border: 1px solid $gray;
	box-shadow: 2px 2px 5px rgba($black, 0.1);
	z-index: 1000;

	li {
		padding: 8px 12px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;

		@include hover {
			&:hover {
				color: $primary;
				background-color: #f0f0f0;
			}
		}
	}
}
</style>
