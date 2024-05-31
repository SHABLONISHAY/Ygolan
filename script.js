window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const backgroundImg = new Image();
    backgroundImg.src = 'images/background.png';
    const playerImg = new Image();
    playerImg.src = 'images/player.png';
    const coinImg1 = new Image();
    coinImg1.src = 'images/coin1.png';
    const coinImg2 = new Image();
    coinImg2.src = 'images/coin2.png';
    const coinImg3 = new Image();
    coinImg3.src = 'images/coin3.png';
    const obstacleImg1 = new Image();
    obstacleImg1.src = 'images/obstacle1.png';
    const obstacleImg2 = new Image();
    obstacleImg2.src = 'images/obstacle2.png';
    const obstacleImg3 = new Image();
    obstacleImg3.src = 'images/obstacle3.png';

    const playerScale = 5;
    const objectScale = 3;  // Reduced scale to two-thirds

    let player = {
        x: 50,
        y: canvas.height - 100 * playerScale,
        width: 50 * playerScale,
        height: 50 * playerScale,
        dy: 0,
        jumpPower: -20,  // Further adjusted jump power
        gravity: 1
    };

    let coins = [];
    let obstacles = [];
    let score = 0;
    let hearts = 5;
    let highScore = 0;
    let backgroundX = 0;
    let speed = 2;
    let invincible = false;
    let invincibleEndTime = 0;

    function generateCoins() {
        for (let i = 0; i < 10; i++) {
            let coin = {
                x: Math.random() * canvas.width * 2,
                y: Math.random() * (canvas.height - 100),
                width: 30 * objectScale,
                height: 30 * objectScale,
                type: Math.floor(Math.random() * 3) + 1
            };
            coins.push(coin);
        }
    }

    function generateObstacles() {
        for (let i = 0; i < 5; i++) {
            let obstacle = {
                x: Math.random() * canvas.width * 2,
                y: canvas.height - 50 * objectScale,
                width: 50 * objectScale,
                height: 50 * objectScale,
                type: Math.floor(Math.random() * 3) + 1
            };
            obstacles.push(obstacle);
        }
    }

    function drawBackground() {
        ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
        ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
        backgroundX -= speed;
        if (backgroundX <= -canvas.width) {
            backgroundX = 0;
        }
    }

    function drawPlayer() {
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    function drawCoins() {
        coins.forEach(coin => {
            let img = coin.type === 1 ? coinImg1 : coin.type === 2 ? coinImg2 : coinImg3;
            ctx.drawImage(img, coin.x, coin.y, coin.width, coin.height);
        });
    }

    function drawObstacles() {
        obstacles.forEach(obstacle => {
            let img = obstacle.type === 1 ? obstacleImg1 : obstacle.type === 2 ? obstacleImg2 : obstacleImg3;
            ctx.drawImage(img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function updatePlayer() {
        player.dy += player.gravity;
        player.y += player.dy;

        if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
            player.dy = 0;
        }
    }

    function updateCoinsAndObstacles() {
        coins.forEach(coin => {
            coin.x -= speed;
        });

        obstacles.forEach(obstacle => {
            obstacle.x -= speed;
        });

        coins = coins.filter(coin => coin.x + coin.width > 0);
        obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

        if (coins.length < 10) {
            generateCoins();
        }

        if (obstacles.length < 5) {
            generateObstacles();
        }
    }

    function handleCollision() {
        coins = coins.filter(coin => {
            if (
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y
            ) {
                score += 10;
                return false;
            }
            return true;
        });

        if (!invincible) {
            obstacles.forEach(obstacle => {
                if (
                    player.x < obstacle.x + obstacle.width &&
                    player.x + player.width > obstacle.x &&
                    player.y < obstacle.y + obstacle.height &&
                    player.y + player.height > obstacle.y
                ) {
                    hearts -= 1;
                    flashScreen('rgba(139, 0, 0, 0.5)');
                    if (hearts <= 0) {
                        alert('המשחק נגמר! הניקוד שלך: ' + score);
                        if (score > highScore) {
                            highScore = score;
                            document.getElementById('highScore').innerText = 'שיא: ' + highScore;
                        }
                        document.location.reload();
                    }
                }
            });
        }
    }

    function drawScoreAndHearts() {
        document.getElementById('score').innerText = 'נקודות: ' + score;
        document.getElementById('hearts').innerText = 'לבבות: ' + hearts;
    }

    function jump() {
        if (player.y + player.height >= canvas.height) {
            player.dy = player.jumpPower;
        }
    }

    function flashScreen(color) {
        invincible = true;
        invincibleEndTime = Date.now() + 1500;
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = color;
        overlay.style.opacity = '0.5';
        overlay.style.zIndex = '1000';
        document.body.appendChild(overlay);

        setTimeout(() => {
            document.body.removeChild(overlay);
            invincible = false;
        }, 1500);
    }

    function increaseSpeed() {
        speed += 0.01;
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawPlayer();
        drawCoins();
        drawObstacles();
        drawScoreAndHearts();
        updatePlayer();
        updateCoinsAndObstacles();
        handleCollision();
        increaseSpeed();

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        }
    });

    backgroundImg.onload = () => {
        generateCoins();
        generateObstacles();
        gameLoop();
    };
};
