class AIChat {
    constructor() {
        this.isMinimized = false;
        this.isLoading = false;
        this.gameStats = {
            gamesPlayed: 0,
            totalScore: 0,
            totalTime: 0,
            bestScore: 0,
            bestTime: 0
        };
        
        this.tips = [
            "保持冷静，不要急于通过每个管道",
            "小鸟会因为重力下降，要预判它的位置",
            "连续点击空格键可以让小鸟保持高度",
            "观察管道的间隙大小，选择最佳通过时机",
            "练习控制小鸟的上升高度，不要飞得太高",
            "专注于游戏节奏，找到属于你的节拍",
            "失败是成功之母，每次游戏都是学习机会",
            "保持手指放在空格键上，反应要快",
            "不要看小鸟，要看前方的管道位置",
            "放松心态，紧张会影响你的判断"
        ];
        
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('toggleChat');
        const sendBtn = document.getElementById('sendButton');
        const messageInput = document.getElementById('messageInput');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        const content = document.getElementById('aiChatContent');
        const toggleBtn = document.getElementById('toggleChat');
        
        this.isMinimized = !this.isMinimized;
        content.style.display = this.isMinimized ? 'none' : 'flex';
        toggleBtn.textContent = this.isMinimized ? '+' : '−';
    }

    addMessage(text, isUser = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("你好！我是你的Flappy Bird助手。我可以给你游戏建议和技巧。试试问我一些问题吧！");
        }, 1000);
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendButton');
        const message = input.value.trim();
        
        if (!message || this.isLoading) return;

        this.addMessage(message, true);
        input.value = '';
        
        this.isLoading = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '发送中...';

        try {
            const response = await this.generateResponse(message);
            this.addMessage(response);
        } catch (error) {
            this.addMessage("抱歉，我现在无法回复。请稍后再试。");
        } finally {
            this.isLoading = false;
            sendBtn.disabled = false;
            sendBtn.textContent = '发送';
        }
    }

    async generateResponse(message) {
        // 阶段1：使用简单的规则回复
        const lowerMessage = message.toLowerCase();
        
        // 游戏建议
        if (lowerMessage.includes('技巧') || lowerMessage.includes('建议') || lowerMessage.includes('怎么') || lowerMessage.includes('如何')) {
            return this.getRandomTip();
        }
        
        // 分数相关
        if (lowerMessage.includes('分数') || lowerMessage.includes('得分')) {
            return "想要获得高分？记住：耐心是关键！不要急于通过管道，观察好间隙再行动。每通过一个管道就得1分，专注于稳定通过而不是速度。";
        }
        
        // 难度相关
        if (lowerMessage.includes('难') || lowerMessage.includes('困难')) {
            return "游戏确实有挑战性！这是正常的。建议你：1)先熟悉小鸟的下降速度 2)练习控制跳跃高度 3)不要连续快速点击，要有节奏感。";
        }
        
        // 时间相关
        if (lowerMessage.includes('时间') || lowerMessage.includes('生存')) {
            return "生存时间反映了你的稳定性！比起追求高分，先专注于延长生存时间。稳定的节奏比快速反应更重要。";
        }

        // 控制相关
        if (lowerMessage.includes('控制') || lowerMessage.includes('操作')) {
            return "控制小鸟的关键是理解它的物理特性：按空格键时小鸟向上跳跃，然后会自然下降。不要等到最后一刻才跳跃！";
        }

        // 默认回复
        const defaultResponses = [
            "这是个很好的问题！记住，练习是提高的唯一方法。",
            "每个玩家都有自己的游戏节奏，找到适合你的就好。",
            "不要气馁！即使是最简单的游戏也需要时间来掌握。",
            "试试放松一下，紧张会影响你的表现。",
            "观察是关键！多看看管道的位置和间隙。"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    getRandomTip() {
        const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
        return `💡 游戏技巧：${randomTip}`;
    }

    updateGameStats(score, time, isGameOver = false) {
        if (isGameOver) {
            this.gameStats.gamesPlayed++;
            this.gameStats.totalScore += score;
            this.gameStats.totalTime += time;
            this.gameStats.bestScore = Math.max(this.gameStats.bestScore, score);
            this.gameStats.bestTime = Math.max(this.gameStats.bestTime, time);
            
            // 游戏结束时给出个性化建议
            setTimeout(() => {
                this.givePersonalizedAdvice(score, time);
            }, 2000);
        }
    }

    givePersonalizedAdvice(score, time) {
        let advice = "";
        
        if (score === 0) {
            advice = "别气馁！第一次玩很难得分是正常的。建议先熟悉一下小鸟的跳跃节奏，多练习几次就会有进步！";
        } else if (score < 5) {
            advice = `不错！你已经通过了${score}个管道。现在专注于保持稳定的节奏，不要急躁。`;
        } else if (score < 10) {
            advice = `很好！${score}分已经是不错的成绩了！你已经掌握了基本技巧，现在试着预判管道位置会更好。`;
        } else {
            advice = `太棒了！${score}分是很高的分数！你已经是个高手了。可以试着挑战更长的生存时间。`;
        }
        
        if (time > 30) {
            advice += ` 你的生存时间${time.toFixed(1)}秒很不错，说明你有很好的耐心和控制力！`;
        }
        
        this.addMessage(advice);
    }

    onGameStart() {
        if (Math.random() < 0.3) { // 30%概率给出开始提示
            setTimeout(() => {
                this.addMessage("游戏开始了！记住保持冷静，观察管道间隙！");
            }, 1000);
        }
    }

    onScoreMilestone(score) {
        if (score === 5) {
            this.addMessage("🎉 太棒了！你已经得到5分了！继续保持这个节奏！");
        } else if (score === 10) {
            this.addMessage("🔥 10分！你已经是个高手了！现在专注于更长时间的生存吧！");
        } else if (score % 20 === 0 && score > 10) {
            this.addMessage(`🚀 惊人的${score}分！你的技术已经很厉害了！`);
        }
    }
}