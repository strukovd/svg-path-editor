import { PathParser } from './path-parser';
import type { PathCommandsAbs, PathCommands, PathCommandsRelative } from './svg-command-types';

export function formatNumber(v: number, d: number, minify = false): string {
    let result = v.toFixed(d)
        .replace(/^(-?[0-9]*\.([0-9]*[1-9])?)0*$/, '$1')
        .replace(/\.$/, '');
    if (minify) {
        result = result.replace(/^(-?)0\./, '$1.');
    }
    return result;
}

export class SimplePoint {
    constructor(
        public x: number,
        public y: number
    ){}
}
// Вертексы
export class AnchorPoint extends SimplePoint {
    itemReference: PathCommand = new StubCommand();
    movable = true;
    constructor(
        x: number,
        y: number,
        movable = true
    ){
        super(x, y);
        this.movable = movable;
    }
}
// Второстипенные / усики / магнитные / контрольные-точки
export class ControlPoint extends AnchorPoint {
    subIndex = 0;
    constructor(
        point: SimplePoint,
        public relations: SimplePoint[],
        movable = true
    ){
        super(point.x, point.y, movable);
    }
}

export abstract class PathCommand {

    constructor(values: number[], relative: boolean) {
        this.values = values;
        this.relative = relative;
    }

    relative: boolean;
    values: number[];
    previousPoint: SimplePoint = new SimplePoint(0, 0);
    absolutePoints: AnchorPoint[] = [];
    absoluteControlPoints: ControlPoint[] = [];

	/**
	 * Это классический паттерн «Фабрика». Он берет массив строк (например, ['M', '10', '20']) и превращает их в нужный объект.
	 * Он определяет, относительная команда или нет (маленькая буква в SVG — относительная, большая — абсолютная).
	 * Создает конкретный экземпляр (например, new MoveTo).
	 * TODO: переделать с ООП на свой формат, типа createCommand('M', [10, 20]) сместо Make
	 * 	В целом концеп - файл попадает в некий конвеер, который рабивает на элементы (теги) и превращает их в объекты (а path - на под объекты)
	 * https://share.google/aimode/e8IGuStaRxlLYoljw
	 * @param rawItem
	 * @returns
	 */
    public static Make(rawItem: string[]): PathCommand {
        let result: PathCommand | undefined = undefined;
        const relative = rawItem[0].toUpperCase() !== rawItem[0];
        const values = rawItem.slice(1).map( it => parseFloat(it) );
        const commandType = rawItem[0].toUpperCase() as PathCommandsAbs;
        switch (commandType) {
            case 'M': result = new MoveTo(values, relative); break;
            case 'L': result = new LineTo(values, relative); break;
            case 'H': result = new HorizontalLineTo(values, relative); break;
            case 'V': result = new VerticalLineTo(values, relative); break;
            case 'Z': result = new ClosePath(values, relative); break;
            case 'C': result = new CurveTo(values, relative); break;
            case 'S': result = new SmoothCurveTo(values, relative); break;
            case 'Q': result = new QuadraticBezierCurveTo(values, relative); break;
            case 'T': result = new SmoothQuadraticBezierCurveTo(values, relative); break;
            case 'A': result = new EllipticalArcTo(values, relative); break;
        }
        if(!result) {
            throw new Error(`Invalid SVG command: ${rawItem[0]}`);
        }
        return result;
    }

    public static MakeFrom(origin: PathCommand, previous: PathCommand, newType: PathCommands): PathCommand { // rename to castTo
        const target = origin.targetLocation();
        const x = target.x.toString();
        const y = target.y.toString();
        let values: string[];
        const absoluteType = newType.toUpperCase() as PathCommandsAbs;
        switch (absoluteType) {
            case 'M': values = ['M', x, y]; break;
            case 'L': values = ['L', x, y]; break;
            case 'H': values = ['H', x]; break;
            case 'V': values = ['V', y]; break;
            case 'Z': values = ['Z']; break;
            case 'C': values = ['C', '0', '0', '0', '0', x, y]; break;
            case 'S': values = ['S', '0', '0', x, y]; break;
            case 'Q': values = ['Q', '0', '0', x, y]; break;
            case 'T': values = ['T', x, y]; break;
            case 'A': values = ['A', '1' , '1', '0', '0', '0', x, y]; break;
        }
        const result = PathCommand.Make(values);

        const controlPoints = origin.absoluteControlPoints;

        result.previousPoint = previous.targetLocation();
        result.absolutePoints = [target];
        result.resetControlPoints(previous);

        if ((origin instanceof CurveTo || origin instanceof SmoothCurveTo)
        && (result instanceof CurveTo || result instanceof SmoothCurveTo)) {
            if (result instanceof CurveTo) {
                result.values[0] = controlPoints[0].x;
                result.values[1] = controlPoints[0].y;
                result.values[2] = controlPoints[1].x;
                result.values[3] = controlPoints[1].y;
            }
            if (result instanceof SmoothCurveTo) {
                result.values[0] = controlPoints[1].x;
                result.values[1] = controlPoints[1].y;
            }
        }

        if ((origin instanceof QuadraticBezierCurveTo || origin instanceof SmoothQuadraticBezierCurveTo)
        && (result instanceof QuadraticBezierCurveTo)) {
            result.values[0] = controlPoints[0].x;
            result.values[1] = controlPoints[0].y;
        }

        if (newType !== absoluteType) {
            result.setRelative(true);
        }
        return result;
    }

    protected refreshAbsolutePoints(origin: SimplePoint, previous: PathCommand | null) {
        this.previousPoint = previous ? previous.targetLocation() : new SimplePoint(0, 0);
        this.absolutePoints = [];
        let current = previous ? previous.targetLocation() : new SimplePoint(0, 0);
        if (!this.relative) {
            current = new SimplePoint(0, 0);
        }
        for (let i = 0 ; i < this.values.length - 1 ; i += 2) {
            this.absolutePoints.push(
                new AnchorPoint(current.x + this.values[i], current.y + this.values[i + 1])
            );
        }
    }

    public setRelative(newRelative: boolean) {
        if (this.relative !== newRelative) {
            this.relative = false;
            if (newRelative) {
                this.translate(-this.previousPoint.x, -this.previousPoint.y);
                this.relative = true;
            } else {
                this.translate(this.previousPoint.x, this.previousPoint.y);
            }
        }
    }

    protected refreshAbsoluteControlPoints(origin: SimplePoint, previous: PathCommand | null) {
        this.absoluteControlPoints = [];
    }

    public resetControlPoints(previousTarget: PathCommand) {
        // Does nothing by default
    }

    public refresh(origin: SimplePoint, previous: PathCommand | null) {
        this.refreshAbsolutePoints(origin, previous);
        this.refreshAbsoluteControlPoints(origin, previous);
        this.absolutePoints.forEach(it => it.itemReference = this );
        this.absoluteControlPoints.forEach(it => it.itemReference = this);
    }

    public translate(x: number, y: number, force = false) {
        if (!this.relative || force) {
            this.values.forEach( (val, idx) => {
                this.values[idx] = val + (idx % 2 === 0 ? x : y);
            });
        }
    }

    public scale(kx: number, ky: number) {
        this.values.forEach( (val, idx) => {
            this.values[idx] = val * (idx % 2 === 0 ? kx : ky);
        });
    }

    public rotate(ox: number, oy: number, degrees: number, force = false) {
        const rad = degrees * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        for(let i = 0 ; i < this.values.length ; i += 2) {
            const px = this.values[i];
            const py = this.values[i + 1];
            const x = this.relative && !force ? 0 : ox;
            const y = this.relative && !force ? 0 : oy;
            const qx = x + (px - x) * cos - (py - y) * sin;
            const qy = y + (px - x) * sin + (py - y) * cos;
            this.values[i] = qx;
            this.values[i + 1] = qy;
        }
    }

    public targetLocation(): AnchorPoint {
        const l = this.absolutePoints.length;
        return this.absolutePoints[l - 1];
    }

    public setTargetLocation(pts: SimplePoint) {
        const loc = this.targetLocation();
        const dx = pts.x - loc.x;
        const dy = pts.y - loc.y;
        const l = this.values.length;
        this.values[l - 2] += dx;
        this.values[l - 1] += dy;
    }

    public setControlLocation(idx: number, pts: SimplePoint) {
        const loc = this.absolutePoints[idx];
        const dx = pts.x - loc.x;
        const dy = pts.y - loc.y;
        this.values[2 * idx] += dx;
        this.values[2 * idx + 1] += dy;
    }

    public controlLocations(): ControlPoint[] {
        return this.absoluteControlPoints;
    }

    public getType(ignoreIsRelative = false): PathCommands {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const typeKey = (this.constructor as any).key as PathCommandsAbs;
        if (this.relative && !ignoreIsRelative) {
            return typeKey.toLowerCase() as PathCommandsRelative;
        }
        return typeKey;
    }

    public asStandaloneString(): string {
        return ['M',
            this.previousPoint.x,
            this.previousPoint.y,
            this.getType(),
            ...this.values
        ].join(' ');
    }

    public asString(decimals = 4, minify = false, trailingItems: PathCommand[] = []): string {
        const strValues = [this.values, ...trailingItems.map(it => it.values)]
            .reduce((acc, val) => acc.concat(val), [])
            .map(it => formatNumber(it, decimals, minify));
        return [this.getType(), ...strValues].join(' ');
    }
}

// Класс заглушка, используется как дефолт значение в AnchorPoint, просто что бы не проверять на null/undefined
class StubCommand extends PathCommand {
    constructor() {
        super([], false);
    }
}
class MoveTo extends PathCommand {
    static readonly key = 'M';
}
class LineTo extends PathCommand {
    static readonly key = 'L';
}
class CurveTo extends PathCommand {
    static readonly key = 'C';
    protected override refreshAbsoluteControlPoints(origin: SimplePoint, previousTarget: PathCommand | null) {
        if(!previousTarget) {
            throw 'Invalid path';
        }
        this.absoluteControlPoints = [
            new ControlPoint(this.absolutePoints[0], [previousTarget.targetLocation()]),
            new ControlPoint(this.absolutePoints[1], [this.targetLocation()])
        ];
    }
    public override resetControlPoints(previousTarget: PathCommand) {
        const a = previousTarget.targetLocation();
        const b = this.targetLocation();
        const d = this.relative ? a : new SimplePoint(0, 0);
        this.values[0] = 2 * a.x / 3 + b.x / 3 - d.x;
        this.values[1] = 2 * a.y / 3 + b.y / 3 - d.y;
        this.values[2] = a.x / 3 + 2 * b.x / 3 - d.x;
        this.values[3] = a.y / 3 + 2 * b.y / 3 - d.y;
    }
}
class SmoothCurveTo extends PathCommand {
    static readonly key = 'S';
    protected override refreshAbsoluteControlPoints(origin: SimplePoint, previousTarget: PathCommand | null) {
        this.absoluteControlPoints = [];
        if ((previousTarget instanceof CurveTo || previousTarget instanceof SmoothCurveTo)) {
            const prevLoc = previousTarget.targetLocation();
            const prevControl = previousTarget.absoluteControlPoints[1];
            const pts = new SimplePoint(2 * prevLoc.x - prevControl.x, 2 * prevLoc.y - prevControl.y);
            this.absoluteControlPoints.push(
                new ControlPoint(pts, [prevLoc], false)
            );
        } else {
            const current = previousTarget ? previousTarget.targetLocation() : new SimplePoint(0, 0);
            const pts = new SimplePoint(current.x, current.y);
            this.absoluteControlPoints.push(
                new ControlPoint(pts, [], false)
            );
        }
        this.absoluteControlPoints.push(
            new ControlPoint(this.absolutePoints[0], [this.targetLocation()]),
        );
    }
    public override asStandaloneString(): string {
        return [
            'M',
            this.previousPoint.x,
            this.previousPoint.y,
            'C',
            this.absoluteControlPoints[0].x,
            this.absoluteControlPoints[0].y,
            this.absoluteControlPoints[1].x,
            this.absoluteControlPoints[1].y,
            this.absolutePoints[1].x,
            this.absolutePoints[1].y
        ].join(' ');
    }
    public override resetControlPoints(previousTarget: PathCommand) {
        const a = previousTarget.targetLocation();
        const b = this.targetLocation();
        const d = this.relative ? a : new SimplePoint(0, 0);
        this.values[0] = a.x / 3 + 2 * b.x / 3 - d.x;
        this.values[1] = a.y / 3 + 2 * b.y / 3 - d.y;
    }
    public override setControlLocation(idx: number, pts: SimplePoint) {
        const loc = this.absoluteControlPoints[1];
        const dx = pts.x - loc.x;
        const dy = pts.y - loc.y;
        this.values[0] += dx;
        this.values[1] += dy;
    }
}
class QuadraticBezierCurveTo extends PathCommand {
    static readonly key = 'Q';
    protected override refreshAbsoluteControlPoints(origin: SimplePoint, previousTarget: PathCommand | null) {
        if(!previousTarget) {
            throw 'Invalid path';
        }
        this.absoluteControlPoints = [
            new ControlPoint(this.absolutePoints[0], [previousTarget.targetLocation(), this.targetLocation()])
        ];
    }
    public override resetControlPoints(previousTarget: PathCommand) {
        const a = previousTarget.targetLocation();
        const b = this.targetLocation();
        const d = this.relative ? a : new SimplePoint(0, 0);
        this.values[0] = a.x / 2 + b.x / 2 - d.x;
        this.values[1] = a.y / 2 + b.y / 2 - d.y;
    }
}
class SmoothQuadraticBezierCurveTo extends PathCommand {
    static readonly key = 'T';
    protected override refreshAbsoluteControlPoints(origin: SimplePoint, previousTarget: PathCommand | null) {
        if (!(previousTarget instanceof QuadraticBezierCurveTo || previousTarget instanceof SmoothQuadraticBezierCurveTo)) {
            const previous = previousTarget ? previousTarget.targetLocation() : new SimplePoint(0, 0);
            const pts = new SimplePoint(previous.x, previous.y);
            this.absoluteControlPoints = [
                new ControlPoint(pts, [], false)
            ];
        } else {
            const prevLoc = previousTarget.targetLocation();
            const prevControl = previousTarget.absoluteControlPoints[0];
            const pts = new SimplePoint(2 * prevLoc.x - prevControl.x, 2 * prevLoc.y - prevControl.y);
            this.absoluteControlPoints = [
                new ControlPoint(pts, [prevLoc, this.targetLocation()], false)
            ];
        }
    }
    public override asStandaloneString(): string {
        return [
            'M',
            this.previousPoint.x,
            this.previousPoint.y,
            'Q',
            this.absoluteControlPoints[0].x,
            this.absoluteControlPoints[0].y,
            this.absolutePoints[0].x,
            this.absolutePoints[0].y
        ].join(' ');
    }
}
class ClosePath extends PathCommand {
    static readonly key = 'Z';
    protected override refreshAbsolutePoints(origin: SimplePoint, previous: PathCommand | null) {
        this.previousPoint = previous ? previous.targetLocation() : new SimplePoint(0, 0);
        this.absolutePoints = [new AnchorPoint(origin.x, origin.y, false)];
    }

}
class HorizontalLineTo extends PathCommand {
    static readonly key = 'H';
    public override rotate(ox:number, oy: number, angle: number, force = false) {
        if (angle == 180) {
            this.values[0] = -this.values[0];
        }
    }
    protected override refreshAbsolutePoints(origin: SimplePoint, previous: PathCommand | null) {
        this.previousPoint = previous ? previous.targetLocation() : new SimplePoint(0, 0);
        if (this.relative) {
            this.absolutePoints = [new AnchorPoint(this.values[0] + this.previousPoint.x, this.previousPoint.y)];
        } else {
            this.absolutePoints = [new AnchorPoint(this.values[0], this.previousPoint.y)];
        }
    }
    public override setTargetLocation(pts: SimplePoint) {
        const loc = this.targetLocation();
        const dx = pts.x - loc.x;
        this.values[0] += dx;
    }
}
class VerticalLineTo extends PathCommand {
    static readonly key = 'V';
    public override rotate(ox:number, oy: number, angle: number, force = false) {
        if (angle == 180) {
            this.values[0] = -this.values[0];
        }
    }
    public override translate(x: number, y: number, force = false) {
        if (!this.relative) {
            this.values[0] += y;
        }
    }
    public override scale(kx: number, ky: number) {
        this.values[0] *= ky;
    }
    protected override refreshAbsolutePoints(origin: SimplePoint, previous: PathCommand | null) {
        this.previousPoint = previous ? previous.targetLocation() : new SimplePoint(0, 0);
        if (this.relative) {
            this.absolutePoints = [new AnchorPoint(this.previousPoint.x, this.values[0] + this.previousPoint.y)];
        } else {
            this.absolutePoints = [new AnchorPoint(this.previousPoint.x, this.values[0])];
        }
    }
    public override setTargetLocation(pts: SimplePoint) {
        const loc = this.targetLocation();
        const dy = pts.y - loc.y;
        this.values[0] += dy;
    }
}
class EllipticalArcTo extends PathCommand {
    static readonly key = 'A';
    public override translate(x: number, y: number, force = false) {
        if (!this.relative) {
            this.values[5] += x;
            this.values[6] += y;
        }
    }
    public override rotate(ox: number, oy: number, degrees: number, force = false) {
        this.values[2] = (this.values[2] + degrees) % 360;
        const rad = degrees * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const px = this.values[5];
        const py = this.values[6];
        const x = this.relative && !force ? 0 : ox;
        const y = this.relative && !force ? 0 : oy;
        const qx = (px - x) * cos - (py - y) * sin + x;
        const qy = (px - x) * sin + (py - y) * cos + y;
        this.values[5] = qx;
        this.values[6] = qy;
    }
    public override scale(kx: number, ky: number) {
        const a = this.values[0];
        const b = this.values[1];
        const angle = Math.PI * this.values[2] / 180.0;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const A = b * b * ky * ky * cos * cos + a * a * ky * ky * sin * sin;
        const B = 2 * kx * ky * cos * sin * (b * b  - a * a );
        const C = a * a * kx * kx * cos * cos + b * b * kx * kx * sin * sin;
        const F = -(a * a * b * b * kx * kx * ky * ky);
        const det = B * B - 4 * A * C;
        const val1 = Math.sqrt((A - C) * (A - C) + B * B);

        // New rotation:
        this.values[2] = B !== 0 ? Math.atan((C - A - val1) / B) * 180 / Math.PI : (A < C ? 0 : 90);

        // New radius-x, radius-y
        if(det !== 0) {
            this.values[0] = -Math.sqrt(2 * det * F * ((A + C) + val1)) / det;
            this.values[1] = -Math.sqrt(2 * det * F * ((A + C) - val1)) / det;
        }

        // New target
        this.values[5] *= kx;
        this.values[6] *= ky;

        // New sweep flag
        this.values[4] = kx * ky >= 0 ? this.values[4] : 1 - this.values[4];
    }
    protected override refreshAbsolutePoints(origin: SimplePoint, previous: PathCommand | null) {
        this.previousPoint = previous ? previous.targetLocation() : new SimplePoint(0, 0);
        if (this.relative) {
            this.absolutePoints = [new AnchorPoint(this.values[5] + this.previousPoint.x, this.values[6] + this.previousPoint.y)];
        } else {
            this.absolutePoints = [new AnchorPoint(this.values[5], this.values[6])];
        }
    }

    public override asString(decimals = 4, minify = false, trailingItems: PathCommand[] = []): string {
        if (!minify) {
            return super.asString(decimals, minify, trailingItems);
        } else {
            const strValues = [this.values, ...trailingItems.map(it => it.values)]
                .map(it => it.map(it2 => formatNumber(it2, decimals, minify)))
                .map(v => `${v[0]} ${v[1]} ${v[2]} ${v[3]}${v[4]}${v[5]} ${v[6]}`);
            return [this.getType(), ...strValues].join(' ');
        }
    }
}


export class Path {
    d: PathCommand[];

	// парсит строку в массив команд path
    constructor(path: string) {
        const rawPath = PathParser.parse(path);
        this.d = rawPath.map( it => PathCommand.Make(it) );
        this.refreshAbsolutePositions();
    }

	/**
	 * Перемещает путь
	 * @param dx Смещение по оси X
	 * @param dy Смещение по оси Y
	 */
    translate(dx: number, dy: number): Path {
        this.d.forEach( (it, idx) => {
            it.translate(dx, dy, idx === 0);
        });
        this.refreshAbsolutePositions();
        return this;
    }

	/**
	 * Масштабирует путь
	 * @param kx Коэффициент масштабирования по оси X
	 * @param ky Коэффициент масштабирования по оси Y
	 */
    scale(kx: number, ky: number): Path {
        this.d.forEach( (it) => {
            it.scale(kx, ky);
        });
        this.refreshAbsolutePositions();
        return this;
    }

	/**
	 * Вращает путь
	 * @param ox Координата X центра поворота
	 * @param oy Координата Y центра поворота
	 * @param degrees Угол поворота в градусах
	 */
    rotate(ox: number, oy: number, degrees: number): Path {
        degrees %= 360;
        if (degrees == 0) {
            return this;
        }

        this.d.forEach( (it, idx) => {
            const lastInstanceOf = it.constructor;
            if (degrees !== 180) {
                if (it instanceof HorizontalLineTo || it instanceof VerticalLineTo) {
                    const newType = (it.relative ? 'l' : 'L');
                    it = this.changeType(it, newType) || it;
                }
            }

            it.rotate(ox, oy, degrees, idx === 0);

            if (degrees === 90 || degrees === 270) {
                if (lastInstanceOf === HorizontalLineTo) {
                    this.refreshAbsolutePositions();

                    const newType = (it.relative ? 'v' : 'V');
                    this.changeType(it, newType);
                } else if (lastInstanceOf === VerticalLineTo) {
                    this.refreshAbsolutePositions();

                    const newType = (it.relative ? 'h' : 'H');
                    this.changeType(it, newType);
                }
            }
        });
        this.refreshAbsolutePositions();
        return this;
    }

	/**
	 * Устанавливает режим относительных координат ()
	 * @param newRelative Новое значение
	 */
    setRelative(newRelative: boolean) {
        this.d.forEach( (it) => {
            it.setRelative(newRelative);
        });
        this.refreshAbsolutePositions();
        return this;
    }

	/**
	 * Удаляет команду
	 * @param item Команда
	 */
    delete(item: PathCommand) { //deleteCommand ?
        const idx = this.d.indexOf(item);
        if (idx !== -1) {
            this.d.splice(idx, 1);
            this.refreshAbsolutePositions();
        }
        return this;
    }

	/**
	 * Добавляет команду
	 * @param item Команда
	 * @param after Команда, после которой будет добавлена новая
	 */
    insert(item: PathCommand, after?: PathCommand) { // addCommand ?
        const idx = after ? this.d.indexOf(after) : -1;
        if (idx !== -1) {
            this.d.splice(idx + 1, 0, item);
        } else {
            this.d.push(item);
        }
        this.refreshAbsolutePositions();
    }

	/**
	 * Изменяет тип команды (cast command to another type)
	 * @param item Команда
	 * @param newType Новый тип
	 */
    changeType(item: PathCommand, newType: PathCommands): PathCommand | null {
        const idx = this.d.indexOf(item);
        if (idx > 0) {
            const previous = this.d[idx - 1];
            this.d[idx] = PathCommand.MakeFrom(item, previous, newType);
            this.refreshAbsolutePositions();
            return this.d[idx];
        }
        return null;
    }

	/**
	 * Возвращает строковое представление пути
	 * @param decimals Количество знаков после запятой
	 * @param minify Признак минификации
	 */
    asString(decimals = 4, minify = false): string {
        return this.d
        .reduce((acc: {type?: string, item: PathCommand, trailing: PathCommand[]}[], it: PathCommand) => {
            // Group together the items that can be merged (M 0 0 L 1 1 => M 0 0 1 1)
            const type = it.getType();
            if (minify && acc.length > 0) {
                const last = acc[acc.length - 1];
                if (last.type === type) {
                    last.trailing.push(it);
                    return acc;
                }
            }
            acc.push({
                type: type === 'm' ? 'l' : (type === 'M' ? 'L' : type),
                item: it,
                trailing: []
            });
            return acc;
        }, [])
        .map(it => {
            const str = it.item.asString(decimals, minify, it.trailing);
            if (minify) {
                return str
                    .replace(/^([a-z]) /i, '$1')
                    .replace(/ -/g, '-')
                    .replace(/(\.[0-9]+) (?=\.)/g, '$1');
            } else {
                return str;
            }
        }).join(minify ? '' : ' ');
    }

	/**
	 * Возвращает точки целевых координат
	 */
    targetLocations(): AnchorPoint[] {
        return this.d.map((command) => command.targetLocation() );
    }

	/**
	 * Возвращает точки контрольных координат
	 */
    controlLocations(): ControlPoint[] {
        let result: ControlPoint[] = [];
        for (let i = 1 ; i < this.d.length ; ++i) {
            const controls = this.d[i].controlLocations();
            controls.forEach((it, idx) => {
                it.subIndex = idx;
            });
            result = [...result, ...controls];
        }
        return result;
    }

	/**
	 * Устанавливает координаты точки
	 * @param ptReference Точка
	 * @param to Координаты
	 */
    setLocation(ptReference: AnchorPoint, to: SimplePoint) {
        if (ptReference instanceof ControlPoint) {
            ptReference.itemReference.setControlLocation(ptReference.subIndex, to);
        } else {
            ptReference.itemReference.setTargetLocation(to);
        }
        this.refreshAbsolutePositions();
    }

	/**
	 * Обновляет координаты абсолютных точек
	 */
    refreshAbsolutePositions() {
        let previous: PathCommand | null = null;
        let origin = new SimplePoint(0, 0);
        for (const item of this.d) {
            item.refresh(origin, previous);

            if (item instanceof MoveTo || item instanceof ClosePath) {
                origin = item.targetLocation();
            }
            previous = item;
        }
    }
}
