<!DOCTYPE html>
<html lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>שבו"ש עושה גיבוש</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #87CEEB;
      position: relative;
      direction: rtl;
    }
    #gameCanvas {
      display: block;
    }
    #scoreBoard {
      position: absolute;
      top: 10px;
      right: 10px;
      color: white;
      font-size: 24px;
      font-family: Arial, sans-serif;
      z-index: 1;
    }
    #gameOverMessage {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 48px;
      font-family: Arial, sans-serif;
      z-index: 1;
      display: none;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <div id="scoreBoard">
    <div id="score">נקודות: 0</div>
    <div id="hearts">לבבות: 5</div>
    <div id="highScore">שיא: 0</div>
  </div>
  <div id="gameOverMessage">נגמר המשחק! הניקוד שלך: 0</div>
  <script src="game.js"></script>
</body>
</html>
