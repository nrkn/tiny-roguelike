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
exports.viewCols = 32;
exports.viewRows = 18;
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

},{"../../lib/grid/bitmap":10}],4:[function(require,module,exports){
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
const direction_1 = require("../lib/geometry/direction");
const point_1 = require("../lib/geometry/point");
const sprites_1 = require("./data/sprites");
const sprite_1 = require("../lib/sprite");
const rect_1 = require("../lib/geometry/rect");
const grid_1 = require("../lib/grid");
exports.createGame = () => {
    const imageData = new ImageData(consts_1.viewWidth, consts_1.viewHeight);
    let level = map_1.createLevel(10);
    const points = grid_1.gridKeys(level.map);
    const mapBounds = grid_1.gridGetBoundingRect(level.map);
    const { x: px, y: py } = points[1];
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
        for (let vy = 0; vy < consts_1.viewRows; vy++) {
            const dy = vy * consts_1.tileHeight;
            const my = mapOffset.y + vy;
            for (let vx = 0; vx < consts_1.viewCols; vx++) {
                const dx = vx * consts_1.tileWidth;
                const mx = mapOffset.x + vx;
                const sprites = [];
                let background = [0, 0, 255];
                if (!rect_1.pointInRect(mapBounds, { x: mx, y: my })) {
                    sprite_1.drawSprites(imageData, sprites, dx, dy, background);
                    continue;
                }
                if (vx === consts_1.centerCol && vy === consts_1.centerRow) {
                    sprites.push(sprites_1.playerSprite);
                }
                const monster = grid_1.gridGet(level.monsters, mx, my);
                if (monster) {
                    if (monster.id === consts_1.ghostId) {
                        sprites.push(sprites_1.ghostSprite);
                    }
                    if (monster.id === consts_1.devilId) {
                        sprites.push(sprites_1.devilSprite);
                    }
                }
                const mapTile = grid_1.gridGet(level.map, mx, my);
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
        if (canMove(x, y))
            return { x, y };
    };
    const canMove = (x, y) => isFloor(x, y) && !isMonster(x, y);
    const isFloor = (x, y) => grid_1.gridGet(level.map, x, y) === consts_1.floorId;
    const isMonster = (x, y) => grid_1.gridGet(level.monsters, x, y) !== undefined;
    const tick = () => {
        const monsterPoints = grid_1.gridKeys(level.monsters);
        monsterPoints.forEach(({ x, y }) => {
            const newPoint = move(direction_1.randomDirection(), x, y);
            if (!newPoint)
                return;
            const { x: nx, y: ny } = newPoint;
            const monster = grid_1.gridGet(level.monsters, x, y);
            if (nx === player.x && ny === player.y) {
                //attack
                return;
            }
            grid_1.gridDelete(level.monsters, x, y);
            grid_1.gridSet(level.monsters, nx, ny, monster);
        });
    };
    return { action, draw };
};

},{"../lib/geometry/direction":7,"../lib/geometry/point":8,"../lib/geometry/rect":9,"../lib/grid":11,"../lib/sprite":13,"./consts":2,"./data/sprites":4,"./map":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const map_1 = require("../lib/map");
const random_1 = require("../lib/util/random");
const grid_1 = require("../lib/grid");
exports.createLevel = (currentLevel) => {
    const monsterCount = currentLevel * 5;
    const mapSize = currentLevel * 100;
    const map = map_1.createTunnels(mapSize);
    const bounds = grid_1.gridGetBoundingRect(map);
    const points = grid_1.gridKeys(map);
    const start = points[0];
    const player = points[1];
    const end = points[points.length - 1];
    ensureWalkable(map, player.x, player.y);
    grid_1.gridSet(map, start.x, start.y, consts_1.stairsUpId);
    grid_1.gridSet(map, end.x, end.y, consts_1.stairsDownId);
    const monsters = createMonsters(monsterCount, map, bounds, player);
    const level = { map, monsters };
    return level;
};
const ensureWalkable = (grid, x, y) => {
    for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
            grid_1.gridSet(grid, dx + x, dy + y, consts_1.floorId);
        }
    }
};
const createMonsters = (count, map, bounds, playerStart) => {
    const { x, y, width, height } = bounds;
    const monsters = {};
    const canPlace = (x, y) => {
        if (x === playerStart.x && y === playerStart.y)
            return false;
        if (grid_1.gridGet(map, x, y) !== consts_1.floorId)
            return false;
        if (grid_1.gridGet(monsters, x, y))
            return false;
        return true;
    };
    for (let i = 0; i < count; i++) {
        const monster = randomMonster();
        let mx = random_1.randInt(width) + x;
        let my = random_1.randInt(height) + y;
        while (!canPlace(mx, my)) {
            mx = random_1.randInt(width) + x;
            my = random_1.randInt(height) + y;
        }
        grid_1.gridSet(monsters, mx, my, monster);
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

},{"../lib/grid":11,"../lib/map":12,"../lib/util/random":14,"./consts":2}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("../util/random");
exports.directionModifiers = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};
exports.directions = ['up', 'down', 'left', 'right'];
exports.randomDirection = () => random_1.pick(exports.directions);

},{"../util/random":14}],8:[function(require,module,exports){
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
const _1 = require(".");
exports.createBitmap = (values) => {
    const data = {};
    for (let y = 0; y < values.length; y++) {
        const row = values[y];
        for (let x = 0; x < row.length; x++) {
            _1.gridSet(data, x, y, row[x] === '1' ? 1 : 0);
        }
    }
    return data;
};

},{".":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rect_1 = require("../geometry/rect");
exports.gridDelete = (data, x, y) => {
    const key = x + ',' + y;
    if (!(key in data))
        return false;
    delete data[key];
    return true;
};
exports.gridGet = (data, x, y) => data[x + ',' + y];
exports.gridSet = (data, x, y, value) => {
    data[x + ',' + y] = value;
    return data;
};
exports.Stop = Symbol('Stop');
exports.gridForEach = (data, cb) => {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[key];
        const [x, y] = key.split(',').map(Number);
        const result = cb(value, x, y, i, data);
        if (result === exports.Stop)
            break;
    }
};
exports.gridKeys = (data) => {
    const keys = Object.keys(data);
    const points = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
        const [x, y] = keys[i].split(',').map(Number);
        points[i] = { x, y };
    }
    return points;
};
exports.gridValues = (data) => {
    const keys = Object.keys(data);
    const values = new Array(keys.length);
    for (let i = 0; i < keys.length; i++)
        values[i] = data[keys[i]];
    return values;
};
exports.gridEntries = (data) => {
    const keys = Object.keys(data);
    const entries = new Array();
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const [x, y] = key.split(',').map(Number);
        entries[i] = [{ x, y }, data[key]];
    }
    return entries;
};
exports.gridEntry = (data, i) => {
    const keys = Object.keys(data);
    const key = keys[i];
    if (key === undefined)
        return;
    const [x, y] = key.split(',').map(Number);
    return [{ x, y }, data[key]];
};
exports.gridSize = (data) => Object.keys(data).length;
exports.gridGetBoundingRect = (data) => {
    const keys = Object.keys(data);
    if (keys.length === 0)
        return rect_1.emptyBoundingRect();
    let left = Number.MAX_VALUE;
    let right = Number.MIN_VALUE;
    let top = Number.MAX_VALUE;
    let bottom = Number.MIN_VALUE;
    for (let i = 0; i < keys.length; i++) {
        const [x, y] = keys[i].split(',').map(Number);
        if (x < left)
            left = x;
        if (x > right)
            right = x;
        if (y < top)
            top = y;
        if (y > bottom)
            bottom = y;
    }
    const width = (right - left) + 1;
    const height = (bottom - top) + 1;
    const rect = {
        left, right, top, bottom, x: left, y: top, width, height
    };
    return rect;
};

},{"../geometry/rect":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const direction_1 = require("./geometry/direction");
const grid_1 = require("./grid");
exports.createTunnels = (numTiles) => {
    const grid = {};
    let x = 0;
    let y = 0;
    grid_1.gridSet(grid, x, y, 1);
    let tileCount = 1;
    while (tileCount < numTiles) {
        const direction = direction_1.randomDirection();
        const modifier = direction_1.directionModifiers[direction];
        x += modifier.x;
        y += modifier.y;
        if (grid_1.gridGet(grid, x, y) !== 1) {
            grid_1.gridSet(grid, x, y, 1);
            tileCount++;
        }
    }
    return grid;
};

},{"./geometry/direction":7,"./grid":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
exports.compositeColor = (sprites, x, y) => {
    for (let i = 0; i < sprites.length; i++) {
        const { bitmap, color } = sprites[i];
        if (grid_1.gridGet(bitmap, x, y))
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
            const index = viewY * width + viewX;
            const destIndex = index * 4;
            const [r, g, b] = (exports.compositeColor(sprites, spriteX, spriteY) || background);
            imageData.data[destIndex] = r;
            imageData.data[destIndex + 1] = g;
            imageData.data[destIndex + 2] = b;
            imageData.data[destIndex + 3] = 255;
        }
    }
};

},{"./grid":11}],14:[function(require,module,exports){
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
