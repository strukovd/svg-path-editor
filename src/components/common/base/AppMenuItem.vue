<template>
	<li class="entry" :class="{ branch: hasChildren }" role="none">
		<button
			type="button"
			class="item"
			:role="item.type === 'checkbox' ? 'menuitemcheckbox' : 'menuitem'"
			:aria-checked="item.type === 'checkbox' ? checked : undefined"
			:aria-haspopup="hasChildren ? 'menu' : undefined"
			@click.stop="activate"
		>
			<span class="marker" aria-hidden="true">{{ item.type === 'checkbox' && checked ? '✓' : '' }}</span>
			<span class="label">{{ item.title || item.key }}</span>
			<span v-if="hasChildren" class="arrow" aria-hidden="true">›</span>
		</button>

		<ul v-if="hasChildren" class="submenu" role="menu">
			<AppMenuItem
				v-for="child of item.children!.items"
				:key="child.key"
				:item="child"
				:checked-keys="checkedKeys"
				@select="emit('select', $event)"
			/>
		</ul>
	</li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MenuItem } from '@/stores/AppStore';

defineOptions({ name: 'AppMenuItem' });

const props = defineProps<{
	item: MenuItem;
	checkedKeys: string[];
}>();

const emit = defineEmits<{
	select: [item: MenuItem];
}>();

const hasChildren = computed(() => Boolean(props.item.children?.items.length));
const checked = computed(() => props.checkedKeys.includes(props.item.key));

function activate() {
	if (hasChildren.value) return;
	emit('select', props.item);
}
</script>
