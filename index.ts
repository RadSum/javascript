const SIZE = 10;
const counter = document.getElementById("score-counter");
const canvas = <HTMLCanvasElement>document.getElementById("my-canvas");
const context = canvas.getContext("2d");
const restartButton = document.getElementById("restart-button");
const highscoreOutput = document.getElementById("highscore-output");
const gamemodeSelection = <HTMLSelectElement>(
    document.getElementById("gamemode-selection")
);
let score = 0;

gamemodeSelection.onchange = () => {
    gamemode = <Mode>gamemodeSelection.value;
};
highscoreOutput.textContent = `Current highscore is ${localStorage.getItem(
    "highscore"
)}`;
restartButton.onclick = resetGame;
restartButton.hidden = true;

type Direction = "right" | "left" | "up" | "down" | "stop";
type FoodPosition = [number, number];
type Mode = "normal" | "moreFood";

class SnakePart {
    px: number;
    py: number;
    size: number;
    prevPosX: number;
    prevPosY: number;

    constructor(px: number, py: number) {
        this.px = px;
        this.py = py;
        this.size = SIZE;
        this.prevPosX = px;
        this.prevPosY = py;
    }

    updatePrevPositions() {
        this.prevPosX = this.px;
        this.prevPosY = this.py;
    }
}

class SnakeHead extends SnakePart {
    constructor(px: number, py: number) {
        super(px, py);
    }

    checkBorderCollision() {
        if (this.px < 0 || this.px > canvas.width - SIZE) {
            return true;
        } else if (this.py < 0 || this.py > canvas.height - SIZE) {
            return true;
        }
        return false;
    }

    checkFoodCollision() {
        let res = false;
        foodPosition.forEach((foodPos) => {
            if (this.px == foodPos[0] && this.py == foodPos[1]) {
                res = true;
            }
        });
        return res;
    }

    checkSelfCollision() {
        let res = false;
        snakeArray.forEach((snakePart, index) => {
            if (
                this.px == snakePart.px &&
                this.py == snakePart.py &&
                index != 0 &&
                index != 1
            ) {
                res = true;
            }
        });
        return res;
    }
}

document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
        case "ArrowUp":
        case "w":
            if (direction != "down" && direction !== "stop") {
                setTimeout(() => {
                    direction = "up";
                }, 50);
            }
            break;
        case "ArrowLeft":
        case "a":
            if (direction != "right" && direction !== "stop") {
                setTimeout(() => {
                    direction = "left";
                }, 50);
            }
            break;
        case "ArrowDown":
        case "s":
            if (direction != "up" && direction !== "stop") {
                setTimeout(() => {
                    direction = "down";
                }, 50);
            }
            break;
        case "ArrowRight":
        case "d":
            if (direction != "left" && direction !== "stop") {
                setTimeout(() => {
                    direction = "right";
                }, 50);
            }
            break;
        case " ":
            if (direction === "stop") {
                direction = lastDirection;
            } else {
                lastDirection = direction;
                direction = "stop";
            }
            break;
        default:
            console.log("Tento key nepohybuje hadem");
    }
});

let direction: Direction = "right";
let lastDirection: Direction;
let snakeHead = new SnakeHead(
    Math.floor(canvas.width / 5),
    Math.floor(canvas.height / 2)
);
let snakeArray: SnakePart[] = [snakeHead];
let foodPosition: FoodPosition[] = [[100, 100]];
let gamemode: Mode = <Mode>gamemodeSelection.value;

let mainInterval = setInterval(snakeGame, 75);

function snakeGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFood(foodPosition);

    snakeArray.forEach((snakePart, index) => {
        drawSnakePart(snakePart);

        snakePart.updatePrevPositions();
        if (snakePart instanceof SnakeHead) {
            switch (direction) {
                case "right":
                    snakePart.px += SIZE;
                    break;
                case "left":
                    snakePart.px -= SIZE;
                    break;
                case "up":
                    snakePart.py -= SIZE;
                    break;
                case "down":
                    snakePart.py += SIZE;
                    break;
                case "stop":
                    break;
            }

            if (snakePart.checkFoodCollision()) {
                if (gamemode == "moreFood") {
                    foodPosition.shift();
                    for (let i = 0; i < 2; i++) {
                        foodPosition.push([
                            getRandomNumber(canvas.width),
                            getRandomNumber(canvas.height),
                        ]);
                    }
                } else {
                    foodPosition = [
                        [getRandomNumber(400), getRandomNumber(400)],
                    ];
                }
                drawFood(foodPosition);
                appendSnake();
                score++;
                counter.textContent = String(score);
            }

            if (
                snakePart.checkBorderCollision() ||
                snakePart.checkSelfCollision()
            ) {
                counter.textContent = `You lost. Your score was ${score}`;
                restartButton.hidden = false;
                clearInterval(mainInterval);
                const highscore = localStorage.getItem("highscore");
                if (+highscore < score) {
                    localStorage.setItem("highscore", String(score));
                    highscoreOutput.textContent = `Current highscore is ${score}`;
                }
            }
        } else {
            if (direction === "stop") return;
            const { prevPosX: px, prevPosY: py } = snakeArray[index - 1];
            snakePart.px = px;
            snakePart.py = py;
        }
    });
}

function resetGame() {
    gamemode = <Mode>gamemodeSelection.value;
    restartButton.hidden = true;
    score = 0;
    counter.textContent = String(score);
    snakeHead = new SnakeHead(
        Math.floor(canvas.width / 5),
        Math.floor(canvas.height / 2)
    );
    snakeArray = [snakeHead];
    foodPosition = [[100, 100]];
    direction = "right";
    lastDirection = undefined;

    mainInterval = setInterval(snakeGame, 75);
}

function drawSnakePart(snakePart: SnakePart) {
    context.fillStyle = "#000000";
    const { px, py, size } = snakePart;

    context.fillRect(px, py, size, size);
}

function drawFood(foodPos: FoodPosition[]) {
    context.fillStyle = "#FF0000";
    for (const [posX, posY] of foodPos) {
        context.fillRect(posX, posY, SIZE, SIZE);
    }
}

function appendSnake() {
    const { px, py } = snakeArray[snakeArray.length - 1];
    const newSnake = new SnakePart(px, py);
    snakeArray.push(newSnake);
}

function getRandomNumber(bounds: number) {
    return Math.floor(Math.random() * (bounds / SIZE)) * SIZE;
}

