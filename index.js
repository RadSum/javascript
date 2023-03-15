const ELEMENT_SIZE = 10;
const counter = document.getElementById("score-counter");
const canvas = document.getElementById("my-canvas");
const context = canvas.getContext("2d");
let score = 0;

class SnakePart {
    constructor(px, py) {
        this.px = px;
        this.py = py;
        this.size = ELEMENT_SIZE;
        this.prevPosX = px;
        this.prevPosX = py;
    }

    checkBorderCollision() {
        if (this.px < 0 || this.px > (canvas.width - ELEMENT_SIZE)) {
            return true;
        } else if (this.py < 0 || this.py > (canvas.height - ELEMENT_SIZE)) {
            return true;
        }
        return false;
    }

    updatePrevPositions() {
        this.prevPosX = this.px;
        this.prevPosY = this.py;
    }

    checkFoodCollision() {
        if (this.px == foodPosition[0] && this.py == foodPosition[1]) {
            return true;
        }
    }
}

let direction = "right";
document.addEventListener("keydown", event => {
    switch(event.key) {
        case "w":
            if (direction != "down") {
                direction = "up";
            }
            break;
        case "a":
            if (direction != "right") {
                direction = "left";
            }
            break;
        case "s":
            if (direction != "up") {
                direction = "down";
            }
            break;
        case "d":
            if (direction != "left") {
                direction = "right";
            }
            break;
        default:
            console.log("Tento key nepohybuje hadem");
    }
});

const snakeHead = new SnakePart(50, 20);
const snakeArray = [snakeHead];
let foodPosition = [100, 100];

const interval = setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFood(foodPosition);
    
    snakeArray.forEach((snakePart, index) => {
        drawSnakePart(snakePart);

        snakePart.updatePrevPositions();
        let foodCollide = false;
        let wallCollide = false;
        if (index == 0) {
            foodCollide = snakePart.checkFoodCollision();
            wallCollide = snakePart.checkBorderCollision();

            switch(direction) {
                case "right":
                    snakePart.px += 10;
                    break;
                case "left":
                    snakePart.px -= 10;
                    break;
                case "up":
                    snakePart.py -= 10;
                    break;
                case "down":
                    snakePart.py += 10;
                    break;
            }
        } else {
            const {prevPosX: px, prevPosY: py} = snakeArray[index - 1];
            snakePart.px = px;
            snakePart.py = py;
        }

        if (foodCollide) {
            foodPosition = [Math.floor(Math.random() * (canvas.width/10)) * 10, Math.floor(Math.random() * (canvas.height/10)) * 10];
            drawFood(foodPosition);
            appendSnake();
            score++;
            counter.textContent = score;
        }

        if (wallCollide) {
            counter.textContent = `You lost. Your score was ${score}`;
            clearInterval(interval);
        }
    });
}, 75);

function drawSnakePart(snakePart) {
    context.fillStyle = "#000000";
    const {px, py, size} = snakePart;

    context.fillRect(px, py, size, size);
}

function drawFood(foodPos) {
    context.fillStyle = "#FF0000";
    context.fillRect(foodPos[0], foodPos[1], ELEMENT_SIZE, ELEMENT_SIZE);
}

function appendSnake() {
    const {px, py} = snakeArray[snakeArray.length - 1];
    const newSnake = new SnakePart(px, py);
    snakeArray.push(newSnake);
}