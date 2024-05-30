window.onload = function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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
    y: canvas.height - 150,
    width: 100,
    height: 100,
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
  let speed = 2;
  let invincible = false;
  let invincibleEndTime = 0;

  function generateCoins() {
    if (coins.length < 10) {
      for (let i = 0; i < 10; i++) {
        let coin = {
          x: canvas.width + Math.random() * canvas.width,
          y: Math.random() * (canvas.height - 200),
          width: 50,
          height: 50,
          type: Math.floor(Math.random() * 3) + 1
        };
        coins.push(coin);
      }
    }
  }

  function generateObstacles() {
    if (obstacles.length < 5) {
      for (let i = 0; i < 5; i++) {
        let obstacle = {
          x: canvas.width + Math.random() * canvas.width,
          y: canvas.height - 150,
          width: 100,
          height: 100,
          type: Math.floor(Math.random() * 3) + 1
        };
        obstacles.push(obstacle);
      }
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
      obstacles.forEach(obstacle => {
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) {
          hearts -= 1;
          flashScreen('darkred');
          if (hearts <= 0) {
            document.getElementById('gameOverMessage').innerText = 'נגמר המשחק! הניקוד שלך: ' + score;
            document.getElementById('gameOverMessage').style.display = 'block';
            if (score > highScore) {
              highScore = score;
              document.getElementById('highScore').innerText = 'שיא: ' + highScore;
            }
            setTimeout(() => {
              document.location.reload();
            }, 2000);
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
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = color;
    flash.style.opacity = '1'; // ללא שקיפות
    flash.style.zIndex = '10';
    document.body.appendChild(flash);
    setTimeout(() => {
      document.body.removeChild(flash);
      invincible = false;
    }, 1500);
  }

  function increaseSpeed() {
    speed += 0.001; // העלאת המהירות בצורה הדרגתית
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
    generateCoins(); // יצירת מטבעות חדשים במידת הצורך
    generateObstacles(); // יצירת מכשולים חדשים במידת הצורך

    requestAnimationFrame(gameLoop);
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      jump();
    }
  });

  let imagesLoaded = 0;
  const imagesToLoad = [
    backgroundImg, playerImg, coinImg1, coinImg2, coinImg3, 
    obstacleImg1, obstacleImg2, obstacleImg3
  ];
  imagesToLoad.forEach(image => {
    image.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === imagesToLoad.length) {
        generateCoins();
        generateObstacles();
        gameLoop();
      }
    };
  });
};
