var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="game.ts" />
var Tetris;
(function (Tetris) {
    var Shape = Gui.Shape;
    var Block = Gui.Block;
    var SquareShape = (function (_super) {
        __extends(SquareShape, _super);
        function SquareShape(cols) {
            var _this = _super.call(this) || this;
            _this.fillColor = 'green';
            var x = cols / 2;
            var y = -2;
            _this.blocks = [];
            _this.blocks.push(new Block(x, y));
            _this.blocks.push(new Block(x + 1, y));
            _this.blocks.push(new Block(x, y + 1));
            _this.blocks.push(new Block(x + 1, y + 1));
            return _this;
        }
        SquareShape.prototype.rotate = function (clockwise) {
            // this shape does not rotate
            return this.blocks;
        };
        SquareShape.prototype.getTop = function () {
            return this.blocks[0];
        };
        SquareShape.prototype.getLeftmost = function () {
            return this.blocks[0];
        };
        SquareShape.prototype.getRightmost = function () {
            return this.blocks[1];
        };
        return SquareShape;
    }(Shape));
    Tetris.SquareShape = SquareShape;
    var LShape = (function (_super) {
        __extends(LShape, _super);
        function LShape(leftHanded, cols) {
            var _this = _super.call(this) || this;
            _this.leftHanded = leftHanded;
            if (leftHanded)
                _this.fillColor = 'yellow';
            else
                _this.fillColor = 'white';
            var x = cols / 2;
            var y = -2;
            _this.blocks = [];
            _this.blocks.push(new Block(x, y - 1));
            _this.blocks.push(new Block(x, y)); // 1 is our base point
            _this.blocks.push(new Block(x, y + 1));
            _this.blocks.push(new Block(x + (leftHanded ? -1 : 1), y + 1));
            return _this;
        }
        LShape.prototype.getTop = function () {
            return this.blocks[0];
        };
        LShape.prototype.getLeftmost = function () {
            return this.blocks[(this.leftHanded ? 3 : 0)];
        };
        LShape.prototype.getRightmost = function () {
            return this.blocks[(this.leftHanded ? 0 : 3)];
        };
        LShape.prototype.rotate = function (clockwise) {
            this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
            var newBlocks = [];
            switch (this.rotation) {
                case 0:
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y - 1));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y + 1));
                    newBlocks.push(new Block(this.blocks[1].x + (this.leftHanded ? -1 : 1), this.blocks[1].y + 1));
                    break;
                case 1:
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x - 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x - 1, this.blocks[1].y + (this.leftHanded ? -1 : 1)));
                    break;
                case 2:
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y + 1));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y - 1));
                    newBlocks.push(new Block(this.blocks[1].x + (this.leftHanded ? 1 : -1), this.blocks[1].y - 1));
                    break;
                case 3:
                    newBlocks.push(new Block(this.blocks[1].x - 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y + (this.leftHanded ? 1 : -1)));
                    break;
            }
            return newBlocks;
        };
        return LShape;
    }(Shape));
    Tetris.LShape = LShape;
    var StepShape = (function (_super) {
        __extends(StepShape, _super);
        function StepShape(leftHanded, cols) {
            var _this = _super.call(this) || this;
            if (leftHanded)
                _this.fillColor = 'cyan';
            else
                _this.fillColor = 'magenta';
            _this.leftHanded = leftHanded;
            var x = cols / 2;
            var y = -1;
            _this.blocks = [];
            _this.blocks.push(new Block(x + (leftHanded ? 1 : -1), y));
            _this.blocks.push(new Block(x, y)); // point 1 is our base point
            _this.blocks.push(new Block(x, y - 1));
            _this.blocks.push(new Block(x + (leftHanded ? -1 : 1), y - 1));
            return _this;
        }
        StepShape.prototype.getTop = function () {
            return this.blocks[1];
        };
        StepShape.prototype.getLeftmost = function () {
            return this.blocks[(this.leftHanded ? 3 : 0)];
        };
        StepShape.prototype.getRightmost = function () {
            return this.blocks[(this.leftHanded ? 0 : 3)];
        };
        StepShape.prototype.rotate = function (clockwise) {
            this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
            var newBlocks = [];
            switch (this.rotation) {
                case 0:
                    newBlocks.push(new Block(this.blocks[1].x + (this.leftHanded ? 1 : -1), this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y - 1));
                    newBlocks.push(new Block(this.blocks[1].x + (this.leftHanded ? -1 : 1), this.blocks[1].y - 1));
                    break;
                case 1:
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y + (this.leftHanded ? 1 : -1)));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y + (this.leftHanded ? -1 : 1)));
                    break;
            }
            return newBlocks;
        };
        return StepShape;
    }(Shape));
    Tetris.StepShape = StepShape;
    var StraightShape = (function (_super) {
        __extends(StraightShape, _super);
        function StraightShape(cols) {
            var _this = _super.call(this) || this;
            _this.fillColor = 'blue';
            var x = cols / 2;
            var y = -2;
            _this.blocks = [];
            _this.blocks.push(new Block(x, y - 2));
            _this.blocks.push(new Block(x, y - 1));
            _this.blocks.push(new Block(x, y)); // point 2 is our base point
            _this.blocks.push(new Block(x, y + 1));
            return _this;
        }
        StraightShape.prototype.getTop = function () {
            return this.blocks[0];
        };
        StraightShape.prototype.getLeftmost = function () {
            return this.blocks[0];
        };
        StraightShape.prototype.getRightmost = function () {
            return this.blocks[0];
        };
        StraightShape.prototype.rotate = function (clockwise) {
            this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
            var newBlocks = [];
            switch (this.rotation) {
                case 0:
                    newBlocks[0] = new Block(this.blocks[2].x, this.blocks[2].y - 2);
                    newBlocks[1] = new Block(this.blocks[2].x, this.blocks[2].y - 1);
                    newBlocks[2] = new Block(this.blocks[2].x, this.blocks[2].y);
                    newBlocks[3] = new Block(this.blocks[2].x, this.blocks[2].y + 1);
                    break;
                case 1:
                    newBlocks[0] = new Block(this.blocks[2].x + 2, this.blocks[2].y);
                    newBlocks[1] = new Block(this.blocks[2].x + 1, this.blocks[2].y);
                    newBlocks[2] = new Block(this.blocks[2].x, this.blocks[2].y);
                    newBlocks[3] = new Block(this.blocks[2].x - 1, this.blocks[2].y);
                    break;
            }
            return newBlocks;
        };
        return StraightShape;
    }(Shape));
    Tetris.StraightShape = StraightShape;
    var TShape = (function (_super) {
        __extends(TShape, _super);
        function TShape(cols) {
            var _this = _super.call(this) || this;
            _this.fillColor = 'red';
            _this.blocks = [];
            var x = cols / 2;
            var y = -2;
            _this.blocks.push(new Block(x - 1, y));
            _this.blocks.push(new Block(x, y)); // point 1 is our base point
            _this.blocks.push(new Block(x + 1, y));
            _this.blocks.push(new Block(x, y + 1));
            return _this;
        }
        TShape.prototype.getTop = function () {
            return this.blocks[3];
        };
        TShape.prototype.getLeftmost = function () {
            return this.blocks[0];
        };
        TShape.prototype.getRightmost = function () {
            return this.blocks[2];
        };
        TShape.prototype.rotate = function (clockwise) {
            this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
            var newBlocks = [];
            switch (this.rotation) {
                case 0:
                    newBlocks.push(new Block(this.blocks[1].x - 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y + 1));
                    break;
                case 1:
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y - 1));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y + 1));
                    newBlocks.push(new Block(this.blocks[1].x - 1, this.blocks[1].y));
                    break;
                case 2:
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x - 1, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y - 1));
                    break;
                case 3:
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y + 1));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y));
                    newBlocks.push(new Block(this.blocks[1].x, this.blocks[1].y - 1));
                    newBlocks.push(new Block(this.blocks[1].x + 1, this.blocks[1].y));
                    break;
            }
            return newBlocks;
        };
        return TShape;
    }(Shape));
    Tetris.TShape = TShape;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=shape.js.map