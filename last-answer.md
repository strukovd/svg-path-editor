Вопрос:
```
Мне нужно с тобой обсудить логику контекста.
Возможно ты читал md файлы, вообщем проект тянется давно, и у меня по чуть чуть складывается понимание того, как лучше хранить состояния сцены, элементов и прочего.
Сейчас я пришел к тому, что mode это одно, это режим отображения (DISPLAY\_MODE) либо как рисунок либо в финальном виде разукрашеным.
В решил что нужно ввести еще context, это понятие нужно для горячих клавиш, типа кликнули Ctrl+A, Ctrl+C что бы слушатель понял над чем именно происходит манипуляция. Еще может для панелей свойств будет полезно, если есть выбранный элемент - контектс элемента подскажет какие свойства показывать.

Если не понял, прочти README.md там я пытался расписать **Концепцию проекта**

Кароче сейчас нужно осмыслить и добить эту тему с конетекстом, если она вообще уместна, я уже добавил Context.vue (точнее это страый Mode.vue) и я думаю что само поле нужно вести в SceneStore.
Но там сейчас только ключ-строка, что не дает никакой информативности, в плане, если элемент выбран то какой? хотя это можно посмотреть в  спомогательных полях..

Вот кароче сейчас я немного плыву как лучше сделать, может ты мне подскажешь..
```

---

Ответ:

Да, `context` здесь уместен. Но важно не превращать его в ещё один вариант `mode`.

Я бы окончательно разделил состояние на независимые оси:

| Поле | На какой вопрос отвечает |
|---|---|
| `displayMode` | Как отображать SVG: контур или финальный вид |
| `activeTool` | Что делает курсор: выбор, `rect`, `line`, `path` и т.д. |
| `context` | Кому сейчас адресованы команды |
| `selectedIds` | Какие элементы выбраны |
| `editableId` | Внутренности какого элемента редактируются |
| `draftElement` | Какой новый элемент сейчас создаётся |

То есть текущий `mode` лучше назвать явно:

```ts
export type SceneDisplayMode = 'OUTLINE' | 'PREVIEW';

displayMode: 'OUTLINE' as SceneDisplayMode,
```

`DRAW` здесь не очень подходит: его легко спутать с рисованием нового элемента.

Контекст я бы сделал не сохраняемым полем, а вычисляемым getter. Иначе появятся два источника истины:

```ts
selectedIds = ['rect-1']
context = 'SCENE' // противоречие
```

Лучше вывести контекст из фактического состояния:

```ts
export type SceneContext =
	| { type: 'SCENE' }
	| { type: 'SELECTION'; elementIds: string[] }
	| { type: 'ELEMENT_EDIT'; elementId: string }
	| { type: 'DRAWING'; tool: SceneTool; draftElementId: string | null };
```

Пример getter в `SceneStore`:

```ts
context(state): SceneContext {
	if (state.draftElement) {
		return {
			type: 'DRAWING',
			tool: state.activeTool!,
			draftElementId: state.draftElement.id,
		};
	}

	if (state.editableId) {
		return {
			type: 'ELEMENT_EDIT',
			elementId: state.editableId,
		};
	}

	if (state.selectedIds.length) {
		return {
			type: 'SELECTION',
			elementIds: state.selectedIds,
		};
	}

	return { type: 'SCENE' };
}
```

Тогда строковый ключ остаётся, но вместе с ним появляется полезная информация:

```ts
switch (sceneStore.context.type) {
	case 'SCENE':
		selectAllElements();
		break;

	case 'SELECTION':
		copyElements(sceneStore.context.elementIds);
		break;

	case 'ELEMENT_EDIT':
		selectAllPoints(sceneStore.context.elementId);
		break;
}
```

Для панели свойств та же схема:

- `SCENE` → свойства сцены;
- `SELECTION` с одним id → свойства конкретного элемента;
- `SELECTION` с несколькими id → общие свойства выделения;
- `ELEMENT_EDIT` → свойства редактируемого элемента/точек;
- `DRAWING` → параметры создаваемой фигуры.

При этом `context` не обязан содержать весь объект элемента. По `elementId` его можно получить через getter. Иначе контекст начнёт дублировать `elements`.

Ещё важный момент: `activeTool` не обязательно определяет контекст. Выбранный инструмент `rect` может оставаться активным между созданиями нескольких прямоугольников, но `DRAWING` начинается только когда существует `draftElement` или отдельная сессия создания.

Распределение ответственности я вижу так:

- [SceneStore.ts](/home/user/repository/pet/svg-path-editor/src/stores/SceneStore.ts:38) хранит исходные поля и вычисляет `context`;
- [useSceneContext.ts](/home/user/repository/pet/svg-path-editor/src/composables/scene/useSceneContext.ts:1) подписывается на клавиатуру и маршрутизирует команды по контексту;
- [Context.vue](/home/user/repository/pet/svg-path-editor/src/components/widgets/footers/Context.vue:50) только отображает текущий контекст;
- панели используют `context` и getters для выбора нужного содержимого.

Сейчас в коде есть две конкретные несостыковки:

- `mode` объявлен как `DRAW | PREVIEW`, но actions всё ещё записывают туда `select`, `transform`, `edit`, `draw`;
- `Context.vue` содержит ключи `SELECTING` и `EDITING`, а computed возвращает `EDIT`, поэтому при появлении `editableId` обращение к `contextMap[currentContext]` сломается.

Итоговая формулировка для конспекта:

> Контекст сцены определяет получателя пользовательских команд. Он вычисляется из текущей операции, редактируемого элемента и выделения. Контекст не хранит состояние элемента, а только сообщает тип цели и идентификаторы, по которым эту цель можно получить.

Так модель остаётся понятной: `displayMode` отвечает за вид, `activeTool` за курсор, `context` за адресата команды, а `selectedIds`/`editableId` за конкретные объекты.