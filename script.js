// Professional Game Navigation with Enhanced Effects

// simple redirect helper used by onclick attributes
function redirectToGame(path) {
    window.location.href = path;
}

const gameNavigation = {
    currentCard: 0,
    cards: [],
    
    init() {
        this.cards = document.querySelectorAll('.game-card');
        this.setupEventListeners();
        this.createAnimationStyles();
        this.applyFadeIn();
        this.addParallaxEffect();
        this.logWelcomeMessage();
    },
    
    setupEventListeners() {
        // Card click navigation
        this.cards.forEach((card, index) => {
            card.setAttribute('tabindex', index);
            
            card.addEventListener('click', (e) => {
                this.playCard(card);
            });
            
            card.addEventListener('mouseenter', () => {
                this.onCardHover(card);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },
    
    playCard(card) {
        const gamePath = card.getAttribute('onclick')?.match(/'([^']*)'/)?.[1];
        if (gamePath) {
            card.style.animation = 'none';
            card.style.opacity = '0.7';
            card.style.transform = 'scale(0.95)';
            
            this.createExitEffect(card);
            
            setTimeout(() => {
                this.navigateTo(gamePath);
            }, 300);
        }
    },
    
    navigateTo(path) {
        const container = document.querySelector('.container');
        container.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        setTimeout(() => {
            window.location.href = path;
        }, 500);
    },
    
    onCardHover(card) {
        card.style.pointerEvents = 'auto';
    },
    
    handleKeyboard(e) {
        const cardCount = this.cards.length;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.currentCard = (this.currentCard + 1) % cardCount;
            this.focusCard(this.currentCard);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.currentCard = (this.currentCard - 1 + cardCount) % cardCount;
            this.focusCard(this.currentCard);
        } else if (e.key === 'Enter') {
            const focused = document.activeElement;
            if (focused.classList.contains('game-card')) {
                this.playCard(focused);
            }
        }
    },
    
    focusCard(index) {
        this.cards[index].focus();
        this.cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
    
    createExitEffect(card) {
        const rect = card.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 5;
            const tx = Math.cos(angle) * velocity * 50;
            const ty = Math.sin(angle) * velocity * 50;
            
            particle.style.position = 'fixed';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
            particle.style.borderRadius = '50%';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.5)';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animation = 'particleExplode 0.6s ease-out forwards';
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    },
    
    createAnimationStyles() {
        const existingStyles = document.querySelectorAll('style');
        let hasAnimations = false;
        
        for (let style of existingStyles) {
            if (style.textContent.includes('particleExplode')) {
                hasAnimations = true;
                break;
            }
        }
        
        if (!hasAnimations) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes particleExplode {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(var(--tx), var(--ty)) scale(0);
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    applyFadeIn() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.animation = 'fadeIn 0.5s ease-out forwards';
        }
    },

    addParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.game-card');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            cards.forEach(card => {
                const cardX = (mouseX - 0.5) * 5;
                const cardY = (mouseY - 0.5) * 5;
                
                const content = card.querySelector('.card-content');
                if (content) {
                    const rotX = cardY + 'deg';
                    const rotY = cardX + 'deg';
                    content.style.transform = 'perspective(1000px) rotateX(' + rotX + ') rotateY(' + rotY + ')';
                }
            });
        });
        
        document.addEventListener('mouseleave', () => {
            document.querySelectorAll('.card-content').forEach(content => {
                content.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    },
    
    logWelcomeMessage() {
        const messages = [
            '🎮 Welcome to FunZone - Ultimate Gaming Platform',
            '✨ Premium gaming experience awaits you',
            '⚡ Navigate with arrow keys or click to play',
            '🏆 Choose your game and dominate!'
        ];
        
        messages.forEach((msg, i) => {
            setTimeout(() => console.log(msg), i * 200);
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => gameNavigation.init());
} else {
    gameNavigation.init();
}

// When the user navigates away, fade the page out. We still keep the
// listener for a nice exit animation, but the style can linger when the
// user comes back using the browser back button (page show from cache).
// Reset the opacity on pageshow so the index page isn't stuck invisible.
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-out';
});

window.addEventListener('pageshow', (event) => {
    // pageshow fires when the page is loaded normally or restored from the
    // back/forward cache. Make sure we are visible again.
    document.body.style.opacity = '1';
});
