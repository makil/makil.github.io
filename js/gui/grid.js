/// <reference path="gui.ts" />
var Gui;
(function (Gui) {
    var Grid = (function () {
        function Grid(rows, cols, blockSize, backColor, canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.blockSize = blockSize;
            this.blockColor = new Array(rows);
            this.backColor = backColor;
            this.cols = cols;
            this.rows = rows;
            for (var r = 0; r < rows; r++) {
                this.blockColor[r] = new Array(cols);
            }
            this.xOffset = 20;
            this.yOffset = 20;
        }
        Grid.prototype.draw = function (shape) {
            this.paintShape(shape, shape.fillColor);
        };
        Grid.prototype.erase = function (shape) {
            this.paintShape(shape, this.backColor);
        };
        Grid.prototype.paintShape = function (shape, color) {
            var _this = this;
            shape.blocks.forEach(function (p) { return _this.paintSquare(p.y, p.x, color); });
        };
        Grid.prototype.getPreferredSize = function () {
            return new Gui.Block(this.blockSize * this.cols, this.blockSize * this.rows);
        };
        // check the set of blocks to see if they are all free
        Grid.prototype.isPosValid = function (blocks) {
            var valid = true;
            for (var i = 0; i < blocks.length; i++) {
                if ((blocks[i].x < 0) ||
                    (blocks[i].x >= this.cols) ||
                    (blocks[i].y >= this.rows)) {
                    valid = false;
                    break;
                }
                if (blocks[i].y >= 0) {
                    if (this.blockColor[blocks[i].y][blocks[i].x] != this.backColor) {
                        valid = false;
                        break;
                    }
                }
            }
            return valid;
        };
        Grid.prototype.addShape = function (shape) {
            for (var i = 0; i < shape.blocks.length; i++) {
                if (shape.blocks[i].y < 0) {
                    // a block has landed and it isn't even fully on the grid yet
                    return false;
                }
                this.blockColor[shape.blocks[i].y][shape.blocks[i].x] = shape.fillColor;
            }
            return true;
        };
        Grid.prototype.eraseGrid = function () {
            this.context.fillStyle = this.backColor;
            var width = this.cols * this.blockSize;
            var height = this.rows * this.blockSize;
            this.context.fillRect(this.xOffset, this.yOffset, width, height);
            this.context.strokeStyle = "red";
            this.context.lineWidth = 0.5;
            for (var i = 0; i < this.rows; i++) {
                this.context.beginPath();
                this.context.moveTo(this.xOffset, this.yOffset + i * this.blockSize);
                this.context.lineTo(width + this.xOffset, this.yOffset + i * this.blockSize);
                this.context.stroke();
            }
            for (var i = 0; i < this.cols; i++) {
                this.context.beginPath();
                this.context.moveTo(this.xOffset + i * this.blockSize, this.yOffset);
                this.context.lineTo(this.xOffset + i * this.blockSize, this.yOffset + height);
                this.context.stroke();
            }
        };
        Grid.prototype.clearGrid = function () {
            for (var row = 0; row < this.rows; row++) {
                for (var col = 0; col < this.cols; col++) {
                    this.blockColor[row][col] = this.backColor;
                }
            }
            this.eraseGrid();
        };
        Grid.prototype.paintSquare = function (row, col, color) {
            if (row >= 0) {
                this.context.fillStyle = color;
                this.context.fillRect(this.xOffset + col * this.blockSize, this.yOffset + row * this.blockSize, this.blockSize - 1, this.blockSize - 1);
            }
        };
        Grid.prototype.drawGrid = function () {
            for (var row = 0; row < this.rows; row++) {
                for (var col = 0; col < this.cols; col++) {
                    if (this.blockColor[row][col] !== this.backColor) {
                        this.paintSquare(row, col, this.blockColor[row][col]);
                    }
                }
            }
        };
        Grid.prototype.paint = function () {
            this.eraseGrid();
            this.drawGrid();
        };
        // only the rows in last shape could have been filled
        Grid.prototype.checkRows = function (lastShape) {
            var rowMin = lastShape.blocks[0].y;
            var rowMax = lastShape.blocks[0].y;
            var rowComplete;
            var rowsRemoved = 0;
            for (var i = 1; i < lastShape.blocks.length; i++) {
                if (lastShape.blocks[i].y < rowMin) {
                    rowMin = lastShape.blocks[i].y;
                }
                if (lastShape.blocks[i].y > rowMax) {
                    rowMax = lastShape.blocks[i].y;
                }
            }
            if (rowMin < 0) {
                rowMin = 0;
            }
            while (rowMax >= rowMin) {
                rowComplete = true;
                for (var col = 0; col < this.cols; col++) {
                    if (this.blockColor[rowMax][col] == this.backColor) {
                        rowComplete = false;
                        break;
                    }
                }
                if (rowComplete) {
                    rowsRemoved++;
                    // shuffle down, stay on this row
                    for (var r = rowMax; r >= 0; r--) {
                        for (col = 0; col < this.cols; col++) {
                            if (r > 0)
                                this.blockColor[r][col] = this.blockColor[r - 1][col];
                            else
                                this.blockColor[r][col] = this.backColor;
                        }
                    }
                    rowMin++;
                }
                else {
                    // move up a row
                    rowMax--;
                }
            }
            if (rowsRemoved > 0) {
                this.eraseGrid();
                this.paint();
            }
            return rowsRemoved;
        };
        Grid.prototype.getTopLeftPosition = function (block) {
            return new Gui.Point(140 + this.blockSize * block.x, 100 + this.blockSize * block.y);
        };
        Grid.prototype.getDownRightPosition = function (block) {
            return new Gui.Point(140 + (this.blockSize * (block.x + 1)), 100 + (this.blockSize * (block.y + 1)));
        };
        return Grid;
    }());
    Gui.Grid = Grid;
})(Gui || (Gui = {}));
//# sourceMappingURL=grid.js.map