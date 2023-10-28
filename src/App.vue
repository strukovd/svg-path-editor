<template>
	<section>
		<aside>

		</aside>
		<div class="editor-side">
			<EditorComponent></EditorComponent>
		</div>
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EditorComponent from '@/components/EditorComponent.vue';

export default defineComponent({
	components: {
		EditorComponent
	}
});
</script>

<style lang="scss">

</style>
