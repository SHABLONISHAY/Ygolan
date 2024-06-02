const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let hearts = 5;
let heartCoins = 0;
let speed = 6; // מהירות התחלתית מוגברת
let isImmune = false;
let immuneTimer = null;

const player = {
    x: 50,
    y: canvas.height - 150,
    width: 150, // גודל מוגדל פי 3
    height: 150, // גודל מוגדל פי 3
    dy: 0,
    jumpHeight: 30,
    gravity: 1.5,
    image: new Image(),
    altImage: new Image(),
    isAltImage: false
};

player.image.src = 'images/player.png';
player.altImage.src = 'images/player2.png';

const obstacles = [];
const coins = [];
const heartCoinsArray = [];

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 50,
        width: 150, // גודל מוגדל פי 3
        height: 150, // גודל מוגדל פי 3
        image: new Image()
    };
    obstacle.image.src = 'images/obstacle.png';
    obstacles.push(obstacle);
}

function createCoin() {
    const coin = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 100) + 50,
        width: 135, // גודל מוגדל פי 3
        height: 135, // גודל מוגדל פי 3
        image: new Image()
    };
    coin.image.src = 'images/coin.png';
    coins.push(coin);
}

function createHeartCoin() {
    const heartCoin = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 100) + 50,
        width: 135, // גודל מוגדל פי 3
        height: 135, // גודל מוגדל פי 3
        image: new Image()
    };
    heartCoin.image.src = 'images/heartcoin.png';
    heartCoinsArray.push(heartCoin);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isImmune) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(player.isAltImage ? player.altImage : player.image, player.x, player.y, player.width, player.height);

    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    coins.forEach(coin => {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
    });

    heartCoinsArray.forEach(heartCoin => {
        ctx.drawImage(heartCoin.image, heartCoin.x, heartCoin.y, heartCoin.width, heartCoin.height);
    });

    document.getElementById('score').textContent = `נקודות: ${score}`;
    document.getElementById('hearts').textContent = `נשמה יתרה: ${hearts}`;
}

function update() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= speed;
    });

    coins.forEach(coin => {
        coin.x -= speed;
    });

    heartCoinsArray.forEach(heartCoin => {
        heartCoin.x -= speed;
    });

    obstacles.forEach((obstacle, index) => {
        if (isCollision(player, obstacle) && !isImmune) {
            hearts--;
            isImmune = true;
            setTimeout(() => {
                isImmune = false;
            }, 1000);
            obstacles.splice(index, 1);
            if (hearts <= 0) {
                alert('Game Over');
                document.location.reload();
            }
        }
    });

    coins.forEach((coin, index) => {
        if (isCollision(player, coin)) {
            score += 10;
            coins.splice(index, 1);
        }
    });

    heartCoinsArray.forEach((heartCoin, index) => {
        if (isCollision(player, heartCoin)) {
            hearts++;
            heartCoins++;
            heartCoinsArray.splice(index, 1);
            if (heartCoins % 5 === 0) {
                player.isAltImage = true;
                isImmune = true;
                clearTimeout(immuneTimer);
                immuneTimer = setTimeout(() => {
                    player.isAltImage = false;
                    isImmune = false;
                }, 20000);
            }
        }
    });

    draw();
    requestAnimationFrame(update);
}

function isCollision(player, object) {
    return (
        player.x < object.x + object.width &&
        player.x + player.width > object.x &&
        player.y < object.y + object.height &&
        player.y + player.height > object.y
    );
}

function jump() {
    if (player.y === canvas.height - player.height) {
        player.dy = -player.jumpHeight;
    } else if (player.dy >= 0) {
        player.dy = -player.jumpHeight;
    }
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        jump();
    }
});

setInterval(createObstacle, 2000);
setInterval(createCoin, 3000);
setInterval(() => {
    if (score >= 1000 && score % 1000 === 0) {
        createHeartCoin();
    }
}, 1000);

update();
