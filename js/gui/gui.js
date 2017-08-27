var Gui;
(function (Gui) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    Gui.Point = Point;
    var Block = (function () {
        function Block(x, y) {
            this.x = x;
            this.y = y;
        }
        return Block;
    }());
    Gui.Block = Block;
    var Shape = (function () {
        function Shape() {
            this.rotation = 0; // what rotation 0,1,2,3
        }
        Shape.prototype.move = function (x, y) {
            var newBlocks = [];
            for (var i = 0; i < this.blocks.length; i++) {
                newBlocks.push(new Block(this.blocks[i].x + x, this.blocks[i].y + y));
            }
            return newBlocks;
        };
        Shape.prototype.setPos = function (newBlocks) {
            this.blocks = newBlocks;
        };
        // return a set of blocks showing where this shape would be if we dropped it one
        Shape.prototype.drop = function () {
            return this.move(0, 1);
        };
        // return a set of blocks showing where this shape would be if we moved left one
        Shape.prototype.moveLeft = function () {
            return this.move(-1, 0);
        };
        // return a set of blocks showing where this shape would be if we moved right one
        Shape.prototype.moveRight = function () {
            return this.move(1, 0);
        };
        // override these
        // return a set of blocks showing where this shape would be if we rotate it
        Shape.prototype.rotate = function (clockwise) {
            throw new Error("This method is abstract");
        };
        // override these
        Shape.prototype.getTop = function () {
            throw new Error("This method is abstract");
        };
        Shape.prototype.getLeftmost = function () {
            throw new Error("This method is abstract");
        };
        Shape.prototype.getRightmost = function () {
            throw new Error("This method is abstract");
        };
        return Shape;
    }());
    Gui.Shape = Shape;
})(Gui || (Gui = {}));
//# sourceMappingURL=gui.js.map