var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var peppita = new Image();
peppita.src = "peppita.png";
var peppitaX = 50;
var peppitaY = canvas.height - 400;
var peppitaSpeed = 4;
var isJumping = false;
var jumpHeight = 100;

var obstacles = [];
var barrierCount = 0;
var inGame = false; 
var animationId;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawObstacles();

    ctx.drawImage(peppita, peppitaX, peppitaY, 60, 60);

    ctx.fillStyle = "#AF7AC5";
    ctx.fillRect(10, 10, 120, 40);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    if (inGame) {
        ctx.fillText("Record: " + barrierCount, 20, 35);
    }

    if (isJumping) {
        peppitaY -= 8;
        if (peppitaY <= canvas.height - 100 - jumpHeight) {
            isJumping = false;
        }
    } else if (peppitaY < canvas.height - 100) {
        peppitaY += 3;
    }

    checkFail();

    animationId = requestAnimationFrame(draw);
}

function drawObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = "purple";
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        obstacles[i].x -= peppitaSpeed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            if (inGame) {
                barrierCount++;
            }
        }
    }

    if (Math.random() < 0.02) {
        var obstacleHeight = Math.random() * 60 + 20;
        var obstacleWidth = Math.random() * 20 + 10;
        obstacles.push({
            x: canvas.width,
            y: canvas.height - obstacleHeight,
            width: obstacleWidth,
            height: obstacleHeight
        });
    }
}

function checkFail() {
    for (var i = 0; i < obstacles.length; i++) {
        if (
            peppitaX < obstacles[i].x + obstacles[i].width &&
            peppitaX + 50 > obstacles[i].x &&
            peppitaY < obstacles[i].y + obstacles[i].height &&
            peppitaY + 50 > obstacles[i].y
        ) {
            document.getElementById("gameOverMessage").innerHTML =
                "Juego terminado. Barreras atravesadas: " + barrierCount;
            document.getElementById("gameOverMessage").style.display = "block";

            document.getElementById("retryButton").style.display = "block";

            cancelAnimationFrame(animationId);
            inGame = false; 

            document.removeEventListener("keydown", jumpListener);
        }
    }
}

document.addEventListener("keydown", jumpListener);

function jumpListener(event) {
    if (event.code === "Space" && !isJumping && inGame) {
        isJumping = true;
    }
}

function retryGame() {
    document.getElementById("gameOverMessage").style.display = "none";
    document.getElementById("retryButton").style.display = "none";

    peppitaY = canvas.height - 100;
    obstacles = [];
    barrierCount = 0;
    inGame = true;  

    animationId = requestAnimationFrame(draw);

    document.addEventListener("keydown", jumpListener);
}

document.addEventListener("DOMContentLoaded", function () {
    draw();
    reproducirSonido();
});

function jugar() {
    var newWindow = window.open('new.html', '_blank');
    reproducirSonido();
}

function reproducirSonido() {
    var audio = document.getElementById("miSonido");
    audio.play();
}
