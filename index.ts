const SIZE = 10;
const counter = document.getElementById("score-counter");
const canvas = <HTMLCanvasElement> document.getElementById("my-canvas");
const context = canvas.getContext("2d");
const highscoreOutput = document.getElementById("highscore-output");
let score = 0;

highscoreOutput.textContent = `Current highscore is ${localStorage.getItem("highscore")}`;

type Direction = "right" | "left" | "up" | "down" | "stop";
type FoodPosition = [number, number];

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
        this.prevPosX = py;
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
        if (this.px < 0 || this.px > (canvas.width - SIZE)) {
            return true;
        } else if (this.py < 0 || this.py > (canvas.height - SIZE)) {
            return true;
        }
        return false;
    }

    checkFoodCollision() {
        if (this.px == foodPosition[0] && this.py == foodPosition[1]) {
            return true;
        }
        return false;
    }

    checkSelfCollision() {
        let res = false;
        snakeArray.forEach((snakePart, index) => {
        if (this.px == snakePart.px && this.py == snakePart.py && index != 0 && index != 1) {
                res = true;
            }
        });
        return res;
    }
}

let direction: Direction = "right";
let lastDirection: Direction;

document.addEventListener("keydown", event => {
    switch(event.key) {
        case "ArrowUp":
        case "w":
            if (direction != "down" && direction !== "stop") {
                direction = "up";
            }
            break;
        case "ArrowLeft":
        case "a":
            if (direction != "right" && direction !== "stop") {
                direction = "left";
            }
            break;
        case "ArrowDown":
        case "s":
            if (direction != "up" && direction !== "stop") {
                direction = "down";
            }
            break;
        case "ArrowRight":
        case "d":
            if (direction != "left" && direction !== "stop") {
                direction = "right";
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

const snakeHead = new SnakeHead(Math.floor(canvas.width/5), Math.floor(canvas.height/2));
const snakeArray: SnakePart[] = [snakeHead];
let foodPosition: FoodPosition = [100, 100];

const interval = setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFood(foodPosition);
    
    snakeArray.forEach((snakePart, index) => {
        drawSnakePart(snakePart);

        snakePart.updatePrevPositions();
        if (snakePart instanceof SnakeHead) {
            switch(direction) {
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
                foodPosition = [getRandomNumber(canvas.width), getRandomNumber(canvas.height)];
                drawFood(foodPosition);
                appendSnake();
                score++;
                counter.textContent = String(score);
            }
    
            if (snakePart.checkBorderCollision() || snakePart.checkSelfCollision()) {
                counter.textContent = `You lost. Your score was ${score}`;
                clearInterval(interval);
                const highscore = localStorage.getItem("highscore");
                if (+highscore < score) {
                    localStorage.setItem("highscore", String(score));
                }
            }
            
        } else {
            if (direction === "stop") return;
            const {prevPosX: px, prevPosY: py} = snakeArray[index - 1];
            snakePart.px = px;
            snakePart.py = py;
        }
    });
}, 75);

function drawSnakePart(snakePart: SnakePart) {
    context.fillStyle = "#000000";
    const {px, py, size} = snakePart;

    context.fillRect(px, py, size, size);
}

function drawFood(foodPos: FoodPosition) {
    context.fillStyle = "#FF0000";
    context.fillRect(foodPos[0], foodPos[1], SIZE, SIZE);
}

function appendSnake() {
    const {px, py} = snakeArray[snakeArray.length - 1];
    const newSnake = new SnakePart(px, py);
    snakeArray.push(newSnake);
}

function getRandomNumber(bounds: number) {
    return Math.floor(Math.random() * (bounds/SIZE)) * SIZE;
}
