window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const flashOverlay = document.getElementById('flashOverlay');

    // Set canvas to fill the entire window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        scaleGameElements();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Load images
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

    let player = {
        x: 50,
        y: canvas.height - 60,
        width: 50,
        height: 50,
        dy: 0,
        jumpPower: -20,
        gravity: 1
    };

    let coins = [];
    let obstacles = [];
    let score = 0;
    let hearts = 5;
    let highScore = 0;
    let backgroundX = 0;
    let speed = 2;  // Start at a slower speed
    let invincible = false;
    let invincibleEndTime = 0;

    function scaleGameElements() {
        player.width = canvas.width / 16;
        player.height = canvas.height / 8;
        player.jumpPower = -canvas.height / 20;

        coins.forEach(coin => {
            coin.width = canvas.width / 26.67;
            coin.height = canvas.height / 13.33;
        });

        obstacles.forEach(obstacle => {
            obstacle.width = canvas.width / 20;
            obstacle.height = canvas.height / 10;
        });
    }

    function generateCoin() {
        let coin = {
            x: canvas.width + Math.random() * canvas.width,
            y: canvas.height - 100 - Math.random() * 50,
            width: canvas.width / 26.67,
            height: canvas.height / 13.33,
            type: Math.floor(Math.random() * 3) + 1
        };
        coins.push(coin);
    }

    function generateObstacle() {
        let lastObstacleX = obstacles.length ? obstacles[obstacles.length - 1].x : 0;
        let obstacle = {
            x: Math.max(canvas.width + Math.random() * canvas.width, lastObstacleX + 150),
            y: canvas.height - canvas.height / 10,
            width: canvas.width / 20,
            height: canvas.height / 10,
            type: Math.floor(Math.random() * 3) + 1
        };
        obstacles.push(obstacle);
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
            if (coin.type === 1) {
                ctx.drawImage(coinImg1, coin.x, coin.y, coin.width, coin.height);
            } else if (coin.type === 2) {
                ctx.drawImage(coinImg2, coin.x, coin.y, coin.width, coin.height);
            } else if (coin.type === 3) {
                ctx.drawImage(coinImg3, coin.x, coin.y, coin.width, coin.height);
            }
            coin.x -= speed;
        });
    }

    function drawObstacles() {
        obstacles.forEach(obstacle => {
            if (obstacle.type === 1) {
                ctx.drawImage(obstacleImg1, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 2) {
                ctx.drawImage(obstacleImg2, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else if (obstacle.type === 3) {
                ctx.drawImage(obstacleImg3, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
            obstacle.x -= speed;
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

    function handleCollision() {
        // Check for coin collisions
        coins = coins.filter(coin => {
            if (
                player.x < coin.x + coin.width &&
                player.x + player.width > coin.x &&
                player.y < coin.y + coin.height &&
                player.y + player.height > coin.y
            ) {
                const points = Math.floor(Math.random() * 5 + 1) * 10;
                score += points;

                if (score % 100 === 0) {
                    hearts += 1;
                    flashScreen('gold');
                }

                return false;
            }
            return true;
        });

        // Check for obstacle collisions
        if (!invincible) {
            obstacles = obstacles.filter(obstacle => {
                if (
                    player.x < obstacle.x + obstacle.width &&
                    player.x + player.width > obstacle.x &&
                    player.y < obstacle.y + obstacle.height &&
                    player.y + player.height > obstacle.y
                ) {
                    hearts -= 1;
                    flashScreen('darkred');
                    if (hearts <= 0) {
                        alert('Game Over! Your score: ' + score);
                        if (score > highScore) {
                            highScore = score;
                            document.getElementById('highScore').innerText = 'High Score: ' + highScore;
                        }
                        document.location.reload();
                    }
                    return false;
                }
                return true;
            });
        }
    }

    function drawScoreAndHearts() {
        document.getElementById('score').innerText = 'Score: ' + score;
        document.getElementById('hearts').innerText = 'Hearts: ' + hearts;
    }

    function jump() {
        if (player.y + player.height >= canvas.height) {
            player.dy = player.jumpPower;
        }
    }

    function flashScreen(color) {
        invincible = true;
        invincibleEndTime = Date.now() + 1500;
        flashOverlay.style.backgroundColor = color;
        flashOverlay.style.opacity = '0.5';
        setTimeout(() => {
            flashOverlay.style.opacity = '0';
            invincible = false;
        }, 1500);
    }

    function increaseSpeed() {
        speed += 0.002;  // Increase speed gradually
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawPlayer();
        drawCoins();
        drawObstacles();
        drawScoreAndHearts();
        updatePlayer();
        handleCollision();
        increaseSpeed();

        // Generate new coins and obstacles
        if (Math.random() < 0.05) {
            generateCoin();
        }
        if (Math.random() < 0.04) {
            generateObstacle();
        }

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        }
    });

    backgroundImg.onload = () => {
        generateCoin();
        generateObstacle();
        gameLoop();
    };
};