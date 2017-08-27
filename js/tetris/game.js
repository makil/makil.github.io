var Tetris;
(function (Tetris) {
    var Grid = Gui.Grid;
    var Game = (function () {
        function Game() {
            this.running = false;
            this.phase = Game.gameState.initial;
            this.scoreLabel = document.getElementById('scoreLabel');
            this.rowsLabel = document.getElementById('rowsLabel');
            this.levelLabel = document.getElementById('levelLabel');
            this.messageLabel = document.getElementById('floatingMessage');
            this.canvas = document.getElementById('gameCanvas');
            this.context = this.canvas.getContext("2d");
            this.grid = new Grid(16, 10, 20, 'black', this.canvas);
            this.grid.eraseGrid();
            this.speed = 1000;
            var x = this;
            var playPauseButton = document.getElementById('playPause');
            playPauseButton.addEventListener('click', function (evt) {
                x.newGame();
            }, false);
            this.canvas.onkeydown = function (e) { x.keyHandler(e); };
            this.canvas.addEventListener('click', function (evt) {
                x.clickHandler(evt);
            }, false);
            document.onkeydown = function (e) { x.keyHandler(e); }; // gets the wrong thing as this, so capturing the right this
            this.showMessage("Press Play to start");
        }
        Game.prototype.draw = function () {
            if (this.phase == Game.gameState.playing) {
                this.grid.paint();
                this.grid.draw(this.currentShape);
                // recursive render loop
                requestAnimFrame((function (self) {
                    return function () { self.draw(); };
                })(this));
            }
        };
        Game.prototype.newGame = function () {
            this.messageLabel.style.display = 'none'; // hide();
            this.grid.clearGrid();
            this.currentShape = this.newShape();
            this.score = 0;
            this.rowsCompleted = 0;
            this.score = 0;
            this.level = -1;
            this.speed = 1000;
            this.phase = Game.gameState.playing;
            // kick off the render loop
            requestAnimFrame((function (self) {
                return function () { self.draw(); };
            })(this));
            this.incrementLevel(); // will start the game timer & update the labels
        };
        Game.prototype.updateLabels = function () {
            this.scoreLabel.innerText = this.score.toString();
            this.rowsLabel.innerText = this.rowsCompleted.toString();
            this.levelLabel.innerText = this.level.toString();
        };
        Game.prototype.gameTimer = function () {
            if (this.phase == Game.gameState.playing) {
                var blocks = this.currentShape.drop();
                if (this.grid.isPosValid(blocks)) {
                    this.currentShape.setPos(blocks);
                }
                else {
                    this.shapeFinished();
                }
            }
        };
        Game.prototype.clickHandler = function (event) {
            var blocks;
            var topPosition = this.grid.getTopLeftPosition(this.currentShape.getTop());
            var leftmostPosition = this.grid.getTopLeftPosition(this.currentShape.getLeftmost());
            var rightmostPosition = this.grid.getDownRightPosition(this.currentShape.getRightmost());
            console.log('click: ' + event.clientX + ',' + event.clientY);
            console.log('shape: ' + this.currentShape.getTop().x + ',' + this.currentShape.getTop().y);
            console.log('topleft y: ' + topPosition.y);
            console.log('topleft x: ' + topPosition.x);
            if (topPosition.y > event.clientY) {
                blocks = this.currentShape.rotate(true);
            }
            else if (leftmostPosition.x > event.clientX) {
                console.log('left ');
                blocks = this.currentShape.moveLeft();
            }
            else if (rightmostPosition.x < event.clientX) {
                console.log('right ');
                blocks = this.currentShape.moveRight();
            }
            if (Array.isArray(blocks) && this.grid.isPosValid(blocks)) {
                this.currentShape.setPos(blocks);
            }
        };
        Game.prototype.keyHandler = function (event) {
            var blocks;
            if (this.phase == Game.gameState.playing) {
                switch (event.keyCode) {
                    case 39:// right
                        blocks = this.currentShape.moveRight();
                        break;
                    case 37:// left
                        blocks = this.currentShape.moveLeft();
                        break;
                    case 38:// up arrow
                        blocks = this.currentShape.rotate(true);
                        break;
                    case 40:// down arrow
                        // erase ourself first
                        blocks = this.currentShape.drop();
                        while (this.grid.isPosValid(blocks)) {
                            this.currentShape.setPos(blocks);
                            blocks = this.currentShape.drop();
                        }
                        this.shapeFinished();
                        break;
                }
                switch (event.keyCode) {
                    case 39: // right
                    case 37: // left
                    case 38:// up
                        if (this.grid.isPosValid(blocks)) {
                            this.currentShape.setPos(blocks);
                        }
                        break;
                }
            }
            else if (event.keyCode == 80) {
                this.togglePause();
            }
            else if (event.keyCode == 70) {
                if ((this.level < 10) && (this.phase == Game.gameState.playing) || (this.phase == Game.gameState.paused)) {
                    this.incrementLevel();
                }
            }
        };
        Game.prototype.togglePause = function () {
            if (this.phase == Game.gameState.paused) {
                this.messageLabel.style.display = 'none'; // hide();
                this.phase = Game.gameState.playing;
                this.draw(); // kick the render loop off again
            }
            else if (this.phase == Game.gameState.playing) {
                this.phase = Game.gameState.paused;
                this.showMessage("PAUSED");
            }
        };
        Game.prototype.showMessage = function (message) {
            this.messageLabel.style.display = 'block'; //show();
            this.messageLabel.innerText = message;
        };
        Game.prototype.incrementLevel = function () {
            this.level++;
            if (this.level < 10) {
                this.speed = 1000 - (this.level * 100);
                clearTimeout(this.timerToken);
                this.timerToken = setInterval((function (self) {
                    return function () { self.gameTimer(); };
                })(this), this.speed);
            }
            this.updateLabels();
        };
        Game.prototype.shapeFinished = function () {
            if (this.grid.addShape(this.currentShape)) {
                this.grid.draw(this.currentShape);
                var completed = this.grid.checkRows(this.currentShape); // and erase them
                this.rowsCompleted += completed;
                this.score += (completed * (this.level + 1) * 10);
                if (this.rowsCompleted > ((this.level + 1) * 10)) {
                    this.incrementLevel();
                }
                this.updateLabels();
                this.currentShape = this.newShape();
            }
            else {
                // game over!
                if (window.console)
                    console.log("Game over");
                this.phase = Game.gameState.gameover;
                this.showMessage("GAME OVER\nPress F2 to Start");
                clearTimeout(this.timerToken);
            }
        };
        Game.prototype.newShape = function () {
            // 7 shapes
            var randomShape = Math.floor(Math.random() * 7);
            var newShape;
            switch (randomShape) {
                case 0:
                    newShape = new Tetris.LShape(false, this.grid.cols);
                    break;
                case 1:
                    newShape = new Tetris.LShape(true, this.grid.cols);
                    break;
                case 2:
                    newShape = new Tetris.TShape(this.grid.cols);
                    break;
                case 3:
                    newShape = new Tetris.StepShape(false, this.grid.cols);
                    break;
                case 4:
                    newShape = new Tetris.StepShape(true, this.grid.cols);
                    break;
                case 5:
                    newShape = new Tetris.SquareShape(this.grid.cols);
                    break;
                case 6:
                    newShape = new Tetris.StraightShape(this.grid.cols);
                    break;
            }
            return newShape;
        };
        Game.gameState = { initial: 0, playing: 1, paused: 2, gameover: 3 };
        return Game;
    }());
    Tetris.Game = Game;
})(Tetris || (Tetris = {}));
//# sourceMappingURL=game.js.map