(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../game");
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const { action, draw } = game_1.createGame();
document.body.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp')
        action('up');
    if (e.key === 'ArrowDown')
        action('down');
    if (e.key === 'ArrowLeft')
        action('left');
    if (e.key === 'ArrowRight')
        action('right');
});
const tick = (timestamp = 0) => {
    const imageData = draw(timestamp);
    if (imageData.width !== canvas.width ||
        imageData.height !== canvas.height) {
        canvas.width = imageData.width;
        canvas.height = imageData.height;
    }
    context.putImageData(imageData, 0, 0);
    requestAnimationFrame(tick);
};
tick();

},{"../game":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileWidth = 8;
exports.tileHeight = 8;
exports.viewCols = 64;
exports.viewRows = 32;
exports.centerCol = Math.floor(exports.viewCols / 2);
exports.centerRow = Math.floor(exports.viewRows / 2);
exports.viewWidth = exports.tileWidth * exports.viewCols;
exports.viewHeight = exports.tileHeight * exports.viewRows;
exports.floorId = 1;
exports.stairsDownId = 2;
exports.stairsUpId = 3;
exports.playerId = 4;
exports.ghostId = 5;
exports.devilId = 6;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitmap_1 = require("../../lib/grid/bitmap");
exports.playerBitmap = bitmap_1.createBitmap([
    '00000000',
    '00111100',
    '01000000',
    '01010100',
    '01000000',
    '00111100',
    '01111110',
    '00100100'
]);
exports.ghostBitmap = bitmap_1.createBitmap([
    '00000000',
    '00000000',
    '00011100',
    '00111110',
    '00101010',
    '00111110',
    '00101010',
    '00000000',
]);
exports.devilBitmap = bitmap_1.createBitmap([
    '00000000',
    '00000000',
    '00100100',
    '00111100',
    '00101000',
    '00111100',
    '01111110',
    '00100100'
]);
exports.stairsUpBitmap = bitmap_1.createBitmap([
    '00111100',
    '00100100',
    '01111110',
    '01000010',
    '11111111',
    '10000001',
    '11111111',
    '00000000',
]);
exports.stairsDownBitmap = bitmap_1.createBitmap([
    '11111111',
    '00000000',
    '01111110',
    '00000000',
    '00111100',
    '00000000',
    '00011000',
    '00000000',
]);

},{"../../lib/grid/bitmap":11}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitmaps_1 = require("./bitmaps");
exports.playerSprite = {
    bitmap: bitmaps_1.playerBitmap,
    color: [0, 0, 0]
};
exports.ghostSprite = {
    bitmap: bitmaps_1.ghostBitmap,
    color: [255, 0, 255]
};
exports.devilSprite = {
    bitmap: bitmaps_1.devilBitmap,
    color: [255, 32, 0]
};
exports.stairsDownSprite = {
    bitmap: bitmaps_1.stairsDownBitmap,
    color: [255, 255, 255]
};
exports.stairsUpSprite = {
    bitmap: bitmaps_1.stairsUpBitmap,
    color: [64, 64, 255]
};

},{"./bitmaps":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const map_1 = require("./map");
const sparse_1 = require("../lib/grid/sparse");
const array_1 = require("../lib/grid/array");
const direction_1 = require("../lib/geometry/direction");
const point_1 = require("../lib/geometry/point");
const sprites_1 = require("./data/sprites");
const sprite_1 = require("../lib/sprite");
const rect_1 = require("../lib/geometry/rect");
exports.createGame = () => {
    const imageData = new ImageData(consts_1.viewWidth, consts_1.viewHeight);
    let level = map_1.createLevel(1);
    const { x: px, y: py } = level.map.start;
    const player = {
        x: px,
        y: py,
        attack: 6,
        defense: 6,
        health: 12
    };
    const action = (action) => {
        const newPoint = move(action, player.x, player.y);
        if (newPoint) {
            Object.assign(player, newPoint);
        }
        tick();
    };
    const draw = (timestamp) => {
        const mapOffset = point_1.translate(player, point_1.scale({ x: consts_1.centerCol, y: consts_1.centerRow }, { x: -1, y: -1 }));
        const mapRect = {
            x: 0, y: 0, width: level.map.grid.width, height: level.map.grid.height
        };
        for (let vy = 0; vy < consts_1.viewRows; vy++) {
            const dy = vy * consts_1.tileHeight;
            const my = mapOffset.y + vy;
            for (let vx = 0; vx < consts_1.viewCols; vx++) {
                const dx = vx * consts_1.tileWidth;
                const mx = mapOffset.x + vx;
                const sprites = [];
                let background = [0, 0, 255];
                if (!rect_1.pointInRect(mapRect, { x: mx, y: my })) {
                    sprite_1.drawSprites(imageData, sprites, dx, dy, background);
                    continue;
                }
                if (vx === consts_1.centerCol && vy === consts_1.centerRow) {
                    sprites.push(sprites_1.playerSprite);
                }
                const monster = sparse_1.sparseGridGet(level.monsters, mx, my);
                if (monster) {
                    if (monster.id === consts_1.ghostId) {
                        sprites.push(sprites_1.ghostSprite);
                    }
                    if (monster.id === consts_1.devilId) {
                        sprites.push(sprites_1.devilSprite);
                    }
                }
                const mapTile = array_1.arrayGridGet(level.map.grid, mx, my);
                if (mapTile) {
                    background = [255, 255, 255];
                    if (mapTile === consts_1.stairsDownId) {
                        background = [0, 0, 128];
                        sprites.push(sprites_1.stairsDownSprite);
                    }
                    if (mapTile === consts_1.stairsUpId) {
                        sprites.push(sprites_1.stairsUpSprite);
                    }
                }
                sprite_1.drawSprites(imageData, sprites, dx, dy, background);
            }
        }
        return imageData;
    };
    const move = (action, x, y) => {
        if (action === 'up')
            y--;
        if (action === 'down')
            y++;
        if (action === 'left')
            x--;
        if (action === 'right')
            x++;
        if (x < 0)
            return;
        if (y < 0)
            return;
        if (x >= level.map.grid.width)
            return;
        if (y >= level.map.grid.height)
            return;
        if (canMove(x, y))
            return { x, y };
    };
    const canMove = (x, y) => isFloor(x, y) && !isMonster(x, y);
    const isFloor = (x, y) => array_1.arrayGridGet(level.map.grid, x, y) === consts_1.floorId;
    const isMonster = (x, y) => sparse_1.sparseGridGet(level.monsters, x, y) !== undefined;
    const tick = () => {
        const monsterPoints = sparse_1.sparseGridKeys(level.monsters);
        monsterPoints.forEach(({ x, y }) => {
            const newPoint = move(direction_1.randomDirection(), x, y);
            if (!newPoint)
                return;
            const { x: nx, y: ny } = newPoint;
            const monster = sparse_1.sparseGridGet(level.monsters, x, y);
            if (nx === player.x && ny === player.y) {
                //attack
                return;
            }
            sparse_1.sparseGridDelete(level.monsters, x, y);
            sparse_1.sparseGridSet(level.monsters, nx, ny, monster);
        });
    };
    return { action, draw };
};

},{"../lib/geometry/direction":7,"../lib/geometry/point":8,"../lib/geometry/rect":9,"../lib/grid/array":10,"../lib/grid/sparse":12,"../lib/sprite":16,"./consts":2,"./data/sprites":4,"./map":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const sparse_1 = require("../lib/grid/sparse");
const map_1 = require("../lib/map");
const point_1 = require("../lib/geometry/point");
const array_1 = require("../lib/grid/array");
const array_2 = require("../lib/util/array");
const random_1 = require("../lib/util/random");
exports.createLevel = (currentLevel) => {
    const monsterCount = currentLevel * 5;
    const mapSize = currentLevel * 100;
    const tunnels = map_1.createTunnels(mapSize);
    const bounds = sparse_1.sparseGridBoundingRect(tunnels.data);
    const { width, height } = bounds;
    const translateBy = point_1.scale(bounds, { x: -1, y: -1 });
    const start = point_1.translate(tunnels.start, translateBy);
    const end = point_1.translate(tunnels.end, translateBy);
    const grid = array_1.createArrayGrid(width, height, array_2.createSequence(width * height, () => 0));
    sparse_1.sparseGridForEach(tunnels.data, (value, x, y) => {
        const dest = point_1.translate({ x, y }, translateBy);
        if (value === 1)
            value = consts_1.floorId;
        array_1.arrayGridSet(grid, dest.x, dest.y, value);
    });
    array_1.arrayGridSet(grid, start.x, start.y, consts_1.stairsUpId);
    array_1.arrayGridSet(grid, end.x, end.y, consts_1.stairsDownId);
    const map = { grid, start, end };
    const monsters = createMonsters(monsterCount, grid);
    const level = { map, monsters };
    return level;
};
const createMonsters = (count, grid) => {
    const { width, height } = grid;
    const monsters = {};
    const canPlace = (x, y) => {
        if (array_1.arrayGridGet(grid, x, y) !== consts_1.floorId)
            return false;
        if (sparse_1.sparseGridGet(grid, x, y))
            return false;
        return true;
    };
    for (let i = 0; i < count; i++) {
        const monster = randomMonster();
        let x = random_1.randInt(width);
        let y = random_1.randInt(height);
        while (!canPlace(x, y)) {
            x = random_1.randInt(width);
            y = random_1.randInt(height);
        }
        sparse_1.sparseGridSet(monsters, x, y, monster);
    }
    return monsters;
};
// 2:1 for ghosts
const monsterTypes = [consts_1.ghostId, consts_1.ghostId, consts_1.devilId];
const randomMonster = () => {
    const id = random_1.pick(monsterTypes);
    let attack = 0;
    let defense = 0;
    let health = 0;
    if (id === consts_1.ghostId) {
        attack = random_1.randInt(2) + 2;
        defense = random_1.randInt(3) + 2;
        health = random_1.randInt(2) + 3;
    }
    if (id === consts_1.devilId) {
        attack = random_1.clt(5) + 1;
        defense = random_1.clt(3) + 1;
        health = random_1.clt(3) + 3;
    }
    const monster = {
        attack, defense, health, id
    };
    return monster;
};

},{"../lib/geometry/point":8,"../lib/grid/array":10,"../lib/grid/sparse":12,"../lib/map":15,"../lib/util/array":17,"../lib/util/random":18,"./consts":2}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("../util/random");
exports.directionModifiers = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};
const directions = ['up', 'down', 'left', 'right'];
exports.randomDirection = () => random_1.pick(directions);

},{"../util/random":18}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const direction_1 = require("./direction");
exports.translate = (a, b) => {
    const x = a.x + b.x;
    const y = a.y + b.y;
    return { x, y };
};
exports.scale = (a, b) => {
    const x = a.x * b.x;
    const y = a.y * b.y;
    return { x, y };
};
exports.getNeighbours = (point) => {
    const up = exports.translate(point, direction_1.directionModifiers.up);
    const down = exports.translate(point, direction_1.directionModifiers.down);
    const left = exports.translate(point, direction_1.directionModifiers.left);
    const right = exports.translate(point, direction_1.directionModifiers.right);
    return { up, down, left, right };
};

},{"./direction":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointInRect = (rect, point) => {
    if (point.x < rect.x)
        return false;
    if (point.y < rect.y)
        return false;
    if (point.x >= rect.x + rect.width)
        return false;
    if (point.y >= rect.y + rect.height)
        return false;
    return true;
};
exports.emptyBoundingRect = () => {
    const left = 0;
    const top = 0;
    const right = 0;
    const bottom = 0;
    const x = 0;
    const y = 0;
    const width = 0;
    const height = 0;
    const rect = { left, top, right, bottom, x, y, width, height };
    return rect;
};

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
exports.createArrayGrid = (width, height, data) => {
    width |= 0;
    height |= 0;
    if (width < 1)
        throw Error('Expected width to be greater than 0');
    if (height < 1)
        throw Error('Expected height to be greater than 0');
    const size = width * height;
    data = data || new Array(size);
    if (data.length !== size)
        throw Error(`Expected data to contain exactly ${size} elements`);
    const arrayGrid = { width, height, data };
    return arrayGrid;
};
exports.arrayGridGet = (grid, x, y) => grid.data[utils_1.getIndex(grid, x, y)];
exports.arrayGridSet = (grid, x, y, value) => {
    grid.data[utils_1.getIndex(grid, x, y)] = value;
    return grid;
};
exports.arrayGridForEach = (grid, cb) => {
    const { width, height } = grid;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (cb(exports.arrayGridGet(grid, x, y), x, y, grid) === -1)
                return;
        }
    }
};

},{"../utils":14}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("../array");
const array_2 = require("../../util/array");
exports.createBitmap = (values) => {
    let width = 0;
    const bits = values.map(s => s.trim().split('')).filter(s => {
        if (s.length) {
            width = s.length > width ? s.length : width;
            return true;
        }
    });
    const height = bits.length;
    const bitmap = array_1.createArrayGrid(width, height, array_2.createSequence(width * height, () => 0));
    array_1.arrayGridForEach(bitmap, (_value, x, y) => {
        if (bits[y][x] === '1') {
            array_1.arrayGridSet(bitmap, x, y, 1);
        }
    });
    return bitmap;
};

},{"../../util/array":17,"../array":10}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rect_1 = require("../../geometry/rect");
exports.sparseGridDelete = (data, x, y) => {
    if (data[y] && data[y][x] !== undefined) {
        delete data[y][x];
        if (!Object.keys(data[y]).length)
            delete data[y];
        return true;
    }
    return false;
};
exports.sparseGridGet = (data, x, y) => {
    if (!data[y])
        return;
    return data[y][x];
};
exports.sparseGridSet = (data, x, y, value) => {
    if (data[y] === undefined)
        data[y] = {};
    data[y][x] = value;
    return data;
};
exports.sparseGridForEach = (data, cb) => {
    const yKeys = Object.keys(data).map(Number);
    for (let i = 0; i < yKeys.length; i++) {
        const y = yKeys[i];
        const xKeys = Object.keys(data[y]).map(Number);
        for (let j = 0; j < xKeys.length; j++) {
            const x = xKeys[j];
            const value = data[y][x];
            if (cb(value, x, y, data) === -1)
                return;
        }
    }
};
exports.sparseGridKeys = (data) => {
    const keys = [];
    exports.sparseGridForEach(data, (_v, x, y) => keys.push({ x, y }));
    return keys;
};
exports.sparseGridEntries = (data) => {
    const values = [];
    exports.sparseGridForEach(data, value => values.push(value));
    return values;
};
exports.sparseGridBoundingRect = (data) => {
    let left = Number.MAX_SAFE_INTEGER;
    let top = Number.MAX_SAFE_INTEGER;
    let right = Number.MIN_SAFE_INTEGER;
    let bottom = Number.MIN_SAFE_INTEGER;
    let any = false;
    exports.sparseGridForEach(data, (_value, x, y) => {
        if (x < left)
            left = x;
        if (y < top)
            top = y;
        if (x > right)
            right = x;
        if (y > bottom)
            bottom = y;
        any = true;
    });
    if (!any)
        return rect_1.emptyBoundingRect();
    const x = left;
    const y = top;
    const width = (right - left) + 1;
    const height = (bottom - top) + 1;
    const rect = { left, top, right, bottom, x, y, width, height };
    return rect;
};

},{"../../geometry/rect":9}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const array_1 = require("../../util/array");
exports.strideGridGet = (grid, x, y, stride) => {
    const index = utils_1.getIndex(grid, x, y) * stride;
    return array_1.createSequence(stride, i => grid.data[index + i]);
};
exports.strideGridSet = (grid, x, y, value, stride) => {
    const index = utils_1.getIndex(grid, x, y) * stride;
    for (let i = 0; i < stride; i++)
        grid.data[index + i] = value[i];
    return grid;
};
exports.strideGridForEach = (grid, cb, stride) => {
    const { width, height } = grid;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (cb(exports.strideGridGet(grid, x, y, stride), x, y, grid) === -1)
                return;
        }
    }
};

},{"../../util/array":17,"../utils":14}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndex = ({ width }, x, y) => y * width + x;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const direction_1 = require("./geometry/direction");
const sparse_1 = require("./grid/sparse");
exports.createTunnels = (numTiles) => {
    const data = {};
    let x = 0;
    let y = 0;
    sparse_1.sparseGridSet(data, x, y, 1);
    const start = { x, y };
    let tileCount = 1;
    while (tileCount < numTiles) {
        const direction = direction_1.randomDirection();
        const modifier = direction_1.directionModifiers[direction];
        x += modifier.x;
        y += modifier.y;
        if (sparse_1.sparseGridGet(data, x, y) !== 1) {
            sparse_1.sparseGridSet(data, x, y, 1);
            tileCount++;
        }
    }
    const end = { x, y };
    const tileMap = { data, start, end };
    return tileMap;
};

},{"./geometry/direction":7,"./grid/sparse":12}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./grid/array");
const stride_1 = require("./grid/stride");
exports.compositeColor = (sprites, x, y) => {
    for (let i = 0; i < sprites.length; i++) {
        const { bitmap, color } = sprites[i];
        if (array_1.arrayGridGet(bitmap, x, y))
            return color;
    }
};
exports.drawSprites = (imageData, sprites, x, y, background) => {
    const { width, height } = imageData;
    for (let spriteY = 0; spriteY < 8; spriteY++) {
        const viewY = y + spriteY;
        if (viewY >= height)
            continue;
        for (let spriteX = 0; spriteX < 8; spriteX++) {
            const viewX = x + spriteX;
            if (viewX >= width)
                continue;
            const [r, g, b] = (exports.compositeColor(sprites, spriteX, spriteY) || background);
            stride_1.strideGridSet(imageData, viewX, viewY, [r, g, b, 255], 4);
        }
    }
};

},{"./grid/array":10,"./grid/stride":13}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequence = (length, cb) => Array.from({ length }, (_v, k) => cb(k));

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randInt = (exclMax) => Math.floor(Math.random() * exclMax);
exports.pick = (values) => values[exports.randInt(values.length)];
exports.clt = (exclMax, samples = 3) => {
    let sum = 0;
    for (let i = 0; i < samples; i++) {
        sum += Math.random();
    }
    sum /= samples;
    return Math.floor(sum * exclMax);
};

},{}]},{},[1]);
