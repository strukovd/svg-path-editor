import { useSceneStore } from '@/stores/SceneStore';

export function useSceneMouse() {
  const sceneStore = useSceneStore();

  // Просто функция хелпер, по сути к хукам и инстансу композабла отношение не имеет
  // Конвертирует координаты клиента в координаты мирового пространства
  // Должна ли вообще быть в композабле? или вынести в обычный utils\хелпер?
  function clientToWorld(clientX: number, clientY: number, svgElement: SVGSVGElement | null) {
    if (!svgElement) return { x: 0, y: 0 };

    const rect = svgElement.getBoundingClientRect();
    const x = sceneStore.camera.x + (clientX - rect.left) * (sceneStore.camera.width / rect.width);
    const y = sceneStore.camera.y + (clientY - rect.top) * (sceneStore.camera.height / rect.height);

    return { x, y };
  }

  // Вещается на onMouseMove сцены, и обновляет координаты курсора при движении
  // Сейчас по сути МУТИРУЕТ поля в сторе
  // Есть ли смысл вешать событие в onMounted (addEventListener('mousemove', ..)) а не вручуню в @mousemove, ведь разницы по сути нету??
  // Сложность ведь была в том, что если store тоже импортирует этот композабл, то получится циклическая зависимость, но по логике стор не должен его импортировать, импортировать композаблы должен только компонент
  function updateCursor(clientX: number, clientY: number, svgElement: SVGSVGElement | null) {
    const { x, y } = clientToWorld(clientX, clientY, svgElement);
    sceneStore.cursor.x = Math.round(x);
    sceneStore.cursor.y = Math.round(y);
  }

  return {
    clientToWorld,
    updateCursor,
  };
}