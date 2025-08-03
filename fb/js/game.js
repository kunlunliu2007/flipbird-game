class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.bird = new Bird();
        this.pipeManager = new PipeManager();
        this.timer = new Timer();
        this.aiChat = new AIChat();
        this.celebration = new CelebrationSystem();
        
        this.gameState = GAME_STATES.MENU;
        this.score = 0;
        this.highScore = getHighScore();
        this.lastLevelScore = 0;
        
        this.backgroundOffset = 0;
        
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleInput();
            } else if (e.code === 'KeyP') {
                e.preventDefault();
                this.togglePause();
            }
        });

        this.canvas.addEventListener('click', () => {
            this.handleInput();
        });

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });

        const pauseButton = document.getElementById('pauseButton');
        pauseButton.addEventListener('click', () => {
            this.togglePause();
        });
    }

    handleInput() {
        switch (this.gameState) {
            case GAME_STATES.MENU:
                this.startGame();
                break;
            case GAME_STATES.PLAYING:
                this.bird.jump();
                break;
            case GAME_STATES.PAUSED:
                this.resumeGame();
                break;
            case GAME_STATES.GAME_OVER:
                this.resetGame();
                break;
        }
    }

    startGame() {
        this.gameState = GAME_STATES.PLAYING;
        this.score = 0;
        this.lastLevelScore = 0;
        this.bird.reset();
        this.pipeManager.reset();
        this.celebration.reset();
        this.timer.start();
        this.aiChat.onGameStart();
        this.updateUI();
    }

    resetGame() {
        this.gameState = GAME_STATES.MENU;
        this.updateUI();
    }

    togglePause() {
        if (this.gameState === GAME_STATES.PLAYING) {
            this.pauseGame();
        } else if (this.gameState === GAME_STATES.PAUSED) {
            this.resumeGame();
        }
    }

    pauseGame() {
        if (this.gameState === GAME_STATES.PLAYING) {
            this.gameState = GAME_STATES.PAUSED;
            this.timer.pause();
            this.updateUI();
        }
    }

    resumeGame() {
        if (this.gameState === GAME_STATES.PAUSED) {
            this.gameState = GAME_STATES.PLAYING;
            this.timer.resume();
            this.updateUI();
        }
    }

    update() {
        // 更新计时器（始终运行，除非游戏结束）
        if (this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.PAUSED) {
            this.timer.update();
        }
        
        // 更新庆祝动画
        this.celebration.update();
        
        if (this.gameState !== GAME_STATES.PLAYING) return;

        this.bird.update();
        this.pipeManager.update();
        
        this.backgroundOffset -= 0.5;
        if (this.backgroundOffset <= -400) {
            this.backgroundOffset = 0;
        }

        const scoreIncrease = this.pipeManager.checkScore(this.bird.x);
        if (scoreIncrease > 0) {
            this.score += scoreIncrease;
            this.checkLevelCompletion();
            this.aiChat.onScoreMilestone(this.score);
            this.updateScore();
        }

        if (this.pipeManager.checkCollisions(this.bird) || 
            this.bird.y <= 0 || 
            this.bird.y >= GAME_CONFIG.canvasHeight - this.bird.size) {
            this.gameOver();
        }
    }

    checkLevelCompletion() {
        // 检查是否达到6的倍数（关卡完成）
        if (this.score > 0 && this.score % 6 === 0 && this.score !== this.lastLevelScore) {
            const level = this.score / 6;
            this.celebration.triggerCelebration(level);
            this.lastLevelScore = this.score;
            
            // 通知AI助手关卡完成
            setTimeout(() => {
                this.aiChat.addMessage(`🎊 恭喜完成第${level}关！你的技术越来越好了！`);
            }, 1000);
        }
    }

    gameOver() {
        this.gameState = GAME_STATES.GAME_OVER;
        const finalTime = this.timer.stop();
        
        if (setHighScore(this.score)) {
            this.highScore = this.score;
        }
        
        this.aiChat.updateGameStats(this.score, finalTime, true);
        this.updateUI();
    }

    render() {
        this.ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
        
        this.drawBackground();
        
        if (this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.PAUSED || this.gameState === GAME_STATES.GAME_OVER) {
            this.pipeManager.draw(this.ctx);
            this.bird.draw(this.ctx);
        }
        
        if (this.gameState === GAME_STATES.MENU || this.gameState === GAME_STATES.GAME_OVER) {
            this.bird.draw(this.ctx);
        }
        
        // 绘制庆祝动画（最后绘制，确保在最顶层）
        this.celebration.draw(this.ctx);
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.canvasHeight);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
        
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, GAME_CONFIG.canvasHeight - 50, GAME_CONFIG.canvasWidth, 50);
        
        for (let i = 0; i < 10; i++) {
            const x = (i * 40 + this.backgroundOffset) % (GAME_CONFIG.canvasWidth + 40);
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(x, GAME_CONFIG.canvasHeight - 30, 20, 20);
        }
    }

    updateScore() {
        document.getElementById('scoreDisplay').textContent = this.score;
    }

    updateTimer() {
        document.getElementById('timeDisplay').textContent = this.timer.getFormattedTime();
    }

    updateUI() {
        const startScreen = document.getElementById('startScreen');
        const gameOverScreen = document.getElementById('gameOverScreen');
        const pausedScreen = document.getElementById('pausedScreen');
        const scoreDisplay = document.getElementById('scoreDisplay');
        const timeDisplay = document.getElementById('timeDisplay');
        const pauseButton = document.getElementById('pauseButton');

        startScreen.classList.toggle('hidden', this.gameState !== GAME_STATES.MENU);
        gameOverScreen.classList.toggle('hidden', this.gameState !== GAME_STATES.GAME_OVER);
        pausedScreen.classList.toggle('hidden', this.gameState !== GAME_STATES.PAUSED);
        
        const showScore = this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.PAUSED;
        scoreDisplay.style.display = showScore ? 'block' : 'none';
        timeDisplay.style.display = (showScore || this.gameState === GAME_STATES.GAME_OVER) ? 'block' : 'none';
        
        const showPauseButton = this.gameState === GAME_STATES.PLAYING || this.gameState === GAME_STATES.PAUSED;
        pauseButton.classList.toggle('hidden', !showPauseButton);
        
        if (this.gameState === GAME_STATES.PLAYING) {
            pauseButton.textContent = '暂停';
        } else if (this.gameState === GAME_STATES.PAUSED) {
            pauseButton.textContent = '继续';
        }

        if (this.gameState === GAME_STATES.GAME_OVER) {
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('finalTime').textContent = this.timer.getFormattedTime();
            document.getElementById('highScore').textContent = this.highScore;
            document.getElementById('bestTime').textContent = this.timer.getBestTimeFormatted();
        }

        if (showScore) {
            this.updateScore();
            this.updateTimer();
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new Game();
});