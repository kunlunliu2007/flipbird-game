class Timer {
    constructor() {
        this.startTime = 0;
        this.pausedTime = 0;
        this.totalPausedDuration = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
        this.bestTimes = this.loadBestTimes();
    }

    start() {
        this.startTime = Date.now();
        this.isRunning = true;
        this.isPaused = false;
        this.elapsedTime = 0;
        this.totalPausedDuration = 0;
    }

    update() {
        if (this.isRunning && !this.isPaused) {
            this.elapsedTime = (Date.now() - this.startTime - this.totalPausedDuration) / 1000;
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = false;
            if (!this.isPaused) {
                this.elapsedTime = (Date.now() - this.startTime - this.totalPausedDuration) / 1000;
            }
            this.saveBestTime(this.elapsedTime);
            return this.elapsedTime;
        }
        return 0;
    }

    pause() {
        if (this.isRunning && !this.isPaused) {
            this.isPaused = true;
            this.pausedTime = Date.now();
        }
    }

    resume() {
        if (this.isRunning && this.isPaused) {
            this.totalPausedDuration += Date.now() - this.pausedTime;
            this.isPaused = false;
        }
    }

    reset() {
        this.startTime = 0;
        this.pausedTime = 0;
        this.totalPausedDuration = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
    }

    getFormattedTime() {
        return this.elapsedTime.toFixed(1) + 's';
    }

    saveBestTime(time) {
        this.bestTimes.push({
            time: time,
            date: new Date().toISOString()
        });
        
        this.bestTimes.sort((a, b) => b.time - a.time);
        
        if (this.bestTimes.length > 10) {
            this.bestTimes = this.bestTimes.slice(0, 10);
        }
        
        localStorage.setItem('flappyBirdBestTimes', JSON.stringify(this.bestTimes));
    }

    loadBestTimes() {
        const saved = localStorage.getItem('flappyBirdBestTimes');
        return saved ? JSON.parse(saved) : [];
    }

    getBestTime() {
        return this.bestTimes.length > 0 ? this.bestTimes[0].time : 0;
    }

    getBestTimeFormatted() {
        const best = this.getBestTime();
        return best > 0 ? best.toFixed(1) + 's' : '0.0s';
    }
}