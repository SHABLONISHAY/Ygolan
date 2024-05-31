<!DOCTYPE html>
<html lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ygolan Game</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #87CEEB;
        }
        canvas {
            border: 1px solid black;
        }
        #scoreboard {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div id="scoreboard">
        <div id="score">ניקוד: 0</div>
        <div id="hearts">לבבות: 5</div>
        <div id="highScore">שיא: 0</div>
    </div>
    <canvas id="gameCanvas"></canvas>
    <script src="script.js"></script>
</body>
</html>
