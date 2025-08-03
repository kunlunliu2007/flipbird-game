const GAME_CONFIG = {
    gravity: 0.12,
    jumpVelocity: -3.5,
    pipeSpeed: -2,
    pipeGap: 150,
    pipeSpacing: 260,
    birdSize: 32,
    pipeWidth: 60,
    birdX: 100,
    canvasWidth: 400,
    canvasHeight: 600
};

const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

function getHighScore() {
    return parseInt(localStorage.getItem('flappyBirdHighScore') || '0');
}

function setHighScore(score) {
    const currentHigh = getHighScore();
    if (score > currentHigh) {
        localStorage.setItem('flappyBirdHighScore', score.toString());
        return true;
    }
    return false;
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}