# Как это работает?
## Объектная модель


- [ ] Контур элементов
- [x] 🎥 Движение каметры
- [x] 🔎 Zoom
  - [x] Автоматическое масштабирование (изм. размеров при zoom) линий
  - [x] Автоматическое масштабирование (изм. размеров при zoom) точке
  - [ ] ꩜
- [x] ⩩ Сетка
  1. Вся сетка лежит в отдельной группе: `<g v-if="grid.enabled" class="grid">` [SceneComponent.vue](/src/components/common/Scene/SceneComponent.vue#L13)
  2. Жирный центральный (0,0) крест рисуется статично, отдельными `<line>` элементами.
  3. В методе [updateGrid](/src/composables/useSceneGrid.ts#L37) на основании видимой области (viewBox) в поля xLines и yLines сохраняются координаты - где должны быть линии.
  Затем в template эти линии рисуются циклом v-for.
     1. В случае zoom или смещения камеры (viewBox меняется) происходит перерасчет видимых линий и перерисовка в шаблоне.
     2. [useSceneGrid.ts](/src/composables/useSceneGrid.ts#L37)

# История
Snapshot-снимки объектной модели

# Атрибуты
Атрибуты сцены
- elements - элементы объектной модели
- selectedIds - Выбранные элементы
- editableId - Редактируемый элемент
- mode: 'select' as SceneMode,
- tool: null as SceneTool | null,
- history: [] as SceneSnapshot[],
- historyCursor: -1,
ready: false,
scene: { // параметры сцены
	width: 0,
	height: 0,
},
camera: { // параметры камеры (viewBox)
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	scale: 1,
	minScale: 0.1,
	stepScale: 0.2,
},