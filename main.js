// Configuration du canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 480;

// Niveau et caméra
const levelWidth = 3000;
let camera = {
    x: 0,
    y: 0
};

// Variables de jeu
let score = 0;
let coins = 0;
let lives = 3;
let time = 400;
let gameOver = false;
let gameStarted = true;
let levelComplete = false;
let levelTransition = false;
let transitionTimer = 0;
let currentWorld = 1;
let currentLevel = 1;

// Clavier
const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && gameOver) {
        restartGame();
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Joueur Mario
const player = {
    x: 100,
    y: 300,
    width: 32,
    height: 32,
    velocityX: 0,
    velocityY: 0,
    speed: 3,
    jumpPower: 15,
    onGround: false,
    facingRight: true,
    color: '#ff0000'
};

// Gravité
const gravity = 0.5;
const maxFallSpeed = 15;

// Plateformes et obstacles
let platforms = [];

// Ennemis
let enemies = [];

// Pièces
let coinItems = [];

// Fonction pour générer un niveau
function generateLevel(world, level) {
    if (world === 1 && level === 1) {
        // Niveau 1-1 (niveau original)
        platforms = [
            { x: 0, y: 430, width: levelWidth, height: 50, color: '#8B4513', type: 'ground' },
            { x: 250, y: 300, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 300, y: 300, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            { x: 350, y: 300, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 500, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            { x: 800, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 850, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 900, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 1100, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            { x: 1300, y: 400, width: 32, height: 30, color: '#C19A6B', type: 'block' },
            { x: 1332, y: 370, width: 32, height: 60, color: '#C19A6B', type: 'block' },
            { x: 1364, y: 340, width: 32, height: 90, color: '#C19A6B', type: 'block' },
            { x: 1396, y: 310, width: 32, height: 120, color: '#C19A6B', type: 'block' },
            { x: 1428, y: 280, width: 32, height: 150, color: '#C19A6B', type: 'block' },
            { x: 1900, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 1932, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 2100, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            { x: 2700, y: 200, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 2850, y: 230, width: 16, height: 200, color: '#000', type: 'flag-pole' },
            { x: 2850, y: 230, width: 80, height: 60, color: '#FF0000', type: 'flag' },
        ];
        
        enemies = [
            { x: 400, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 650, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1050, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1200, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1600, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1800, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 2050, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 2400, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
        ];
        
        coinItems = [
            { x: 280, y: 380, width: 24, height: 24, collected: false },
            { x: 460, y: 310, width: 24, height: 24, collected: false },
            { x: 850, y: 200, width: 24, height: 24, collected: false },
            { x: 1050, y: 310, width: 24, height: 24, collected: false },
            { x: 1400, y: 240, width: 24, height: 24, collected: false },
            { x: 1600, y: 310, width: 24, height: 24, collected: false },
            { x: 1780, y: 240, width: 24, height: 24, collected: false },
            { x: 2050, y: 310, width: 24, height: 24, collected: false },
            { x: 2350, y: 310, width: 24, height: 24, collected: false },
            { x: 2550, y: 240, width: 24, height: 24, collected: false },
        ];
    } else if (world === 1 && level === 2) {
        // Niveau 1-2 (nouveau design avec plus de tuyaux et blocs)
        platforms = [
            { x: 0, y: 430, width: levelWidth, height: 50, color: '#8B4513', type: 'ground' },
            // Début avec des tuyaux
            { x: 300, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            { x: 450, y: 340, width: 64, height: 90, color: '#00FF00', type: 'pipe' },
            { x: 600, y: 310, width: 64, height: 120, color: '#00FF00', type: 'pipe' },
            // Blocs flottants
            { x: 800, y: 280, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            { x: 850, y: 280, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 900, y: 280, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 950, y: 280, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            // Plateforme de briques
            { x: 1100, y: 350, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            { x: 1132, y: 350, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            { x: 1164, y: 350, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            { x: 1196, y: 350, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            { x: 1228, y: 350, width: 32, height: 32, color: '#C19A6B', type: 'block' },
            // Tuyaux espacés
            { x: 1400, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            { x: 1600, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            // Blocs suspendus avec pièces
            { x: 1800, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 1850, y: 200, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 1900, y: 250, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            // Escalier descendant
            { x: 2100, y: 280, width: 32, height: 150, color: '#C19A6B', type: 'block' },
            { x: 2132, y: 310, width: 32, height: 120, color: '#C19A6B', type: 'block' },
            { x: 2164, y: 340, width: 32, height: 90, color: '#C19A6B', type: 'block' },
            { x: 2196, y: 370, width: 32, height: 60, color: '#C19A6B', type: 'block' },
            { x: 2228, y: 400, width: 32, height: 30, color: '#C19A6B', type: 'block' },
            // Zone finale
            { x: 2400, y: 300, width: 32, height: 32, color: '#FFD700', type: 'coin-block' },
            { x: 2600, y: 366, width: 64, height: 64, color: '#00FF00', type: 'pipe' },
            // Drapeau
            { x: 2850, y: 230, width: 16, height: 200, color: '#000', type: 'flag-pole' },
            { x: 2850, y: 230, width: 80, height: 60, color: '#FF0000', type: 'flag' },
        ];
        
        enemies = [
            { x: 500, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 750, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 950, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1000, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1300, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1500, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 1700, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 2000, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 2300, y: 398, width: 32, height: 32, velocityX: 1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
            { x: 2500, y: 398, width: 32, height: 32, velocityX: -1, velocityY: 0, color: '#8B4513', alive: true, type: 'goomba' },
        ];
        
        coinItems = [
            { x: 350, y: 320, width: 24, height: 24, collected: false },
            { x: 500, y: 290, width: 24, height: 24, collected: false },
            { x: 650, y: 260, width: 24, height: 24, collected: false },
            { x: 875, y: 230, width: 24, height: 24, collected: false },
            { x: 1150, y: 310, width: 24, height: 24, collected: false },
            { x: 1450, y: 320, width: 24, height: 24, collected: false },
            { x: 1650, y: 320, width: 24, height: 24, collected: false },
            { x: 1850, y: 150, width: 24, height: 24, collected: false },
            { x: 2050, y: 240, width: 24, height: 24, collected: false },
            { x: 2450, y: 250, width: 24, height: 24, collected: false },
        ];
    } else {
        // Niveau par défaut (réutiliser 1-1)
        generateLevel(1, 1);
    }
}

// Fonction de mise à jour du joueur
function updatePlayer() {
    // Mouvements horizontaux
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.velocityX = -player.speed;
        player.facingRight = false;
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.velocityX = player.speed;
        player.facingRight = true;
    } else {
        player.velocityX *= 0.8; // Friction
    }

    // Saut
    if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }

    // Gravité
    player.velocityY += gravity;
    if (player.velocityY > maxFallSpeed) {
        player.velocityY = maxFallSpeed;
    }

    // Appliquer les vitesses
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Limites du niveau
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > levelWidth) player.x = levelWidth - player.width;
    
    // Mise à jour de la caméra pour suivre le joueur
    camera.x = player.x - canvas.width / 3;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > levelWidth - canvas.width) camera.x = levelWidth - canvas.width;

    // Mort si tombe
    if (player.y > canvas.height) {
        lives--;
        if (lives <= 0) {
            endGame();
        } else {
            resetPlayerPosition();
        }
    }

    // Collision avec les plateformes
    player.onGround = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            handlePlatformCollision(platform);
        }
    });

    // Collision avec les ennemis
    enemies.forEach(enemy => {
        if (enemy.alive && checkCollision(player, enemy)) {
            handleEnemyCollision(enemy);
        }
    });

    // Collecter les pièces
    coinItems.forEach(coin => {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            coins++;
            score += 100;
            updateUI();
        }
    });
    
    // Vérifier si le joueur touche le drapeau
    const flagPole = platforms.find(p => p.type === 'flag-pole');
    if (flagPole && checkCollision(player, flagPole) && !levelComplete) {
        completeLevel();
    }
}

// Gestion des collisions avec les plateformes
function handlePlatformCollision(platform) {
    const playerBottom = player.y + player.height;
    const playerRight = player.x + player.width;
    const platformBottom = platform.y + platform.height;
    const platformRight = platform.x + platform.width;

    // Collision par le haut (atterrissage)
    if (player.velocityY > 0 && playerBottom <= platform.y + 20) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
    }
    // Collision par le bas (tape la tête)
    else if (player.velocityY < 0 && player.y >= platformBottom - 15) {
        player.y = platformBottom;
        player.velocityY = 0;
        
        // Bloc à pièces - plus facile à frapper
        if (platform.type === 'coin-block' && platform.color === '#FFD700') {
            platform.color = '#C19A6B';
            coins++;
            score += 200;
            updateUI();
            
            // Animation de saut du bloc
            platform.originalY = platform.originalY || platform.y;
            platform.bounceOffset = -10;
        }
        // Bloc normal
        else if (platform.type === 'block') {
            platform.originalY = platform.originalY || platform.y;
            platform.bounceOffset = -5;
        }
    }
    // Collision par les côtés
    else if (playerRight > platform.x && player.x < platformRight) {
        if (player.x < platform.x) {
            player.x = platform.x - player.width;
        } else {
            player.x = platformRight;
        }
        player.velocityX = 0;
    }
}

// Gestion des collisions avec les ennemis
function handleEnemyCollision(enemy) {
    const playerBottom = player.y + player.height;
    
    // Si Mario tombe sur l'ennemi
    if (player.velocityY > 0 && playerBottom < enemy.y + 20) {
        enemy.alive = false;
        player.velocityY = -8; // Petit rebond
        score += 100;
        updateUI();
    } else {
        // Mario est touché
        lives--;
        if (lives <= 0) {
            endGame();
        } else {
            resetPlayerPosition();
        }
    }
}

// Vérification de collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Mise à jour des ennemis
function updateEnemies() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;

        // Appliquer la gravité
        enemy.velocityY += gravity;
        if (enemy.velocityY > maxFallSpeed) {
            enemy.velocityY = maxFallSpeed;
        }

        // Appliquer les mouvements
        enemy.x += enemy.velocityX;
        enemy.y += enemy.velocityY;

        // Inverse la direction aux bords du niveau
        if (enemy.x < 0 || enemy.x + enemy.width > levelWidth) {
            enemy.velocityX *= -1;
        }

        // Collision avec les plateformes
        let onGround = false;
        platforms.forEach(platform => {
            if (checkCollision(enemy, platform)) {
                const enemyBottom = enemy.y + enemy.height;
                const enemyRight = enemy.x + enemy.width;
                const platformBottom = platform.y + platform.height;
                const platformRight = platform.x + platform.width;

                // Collision par le haut (atterrissage)
                if (enemy.velocityY > 0 && enemyBottom <= platform.y + 20) {
                    enemy.y = platform.y - enemy.height;
                    enemy.velocityY = 0;
                    onGround = true;
                }
                // Collision par les côtés (inverse la direction)
                else if (enemyRight > platform.x && enemy.x < platformRight) {
                    enemy.velocityX *= -1;
                    enemy.x += enemy.velocityX * 2;
                }
            }
        });
    });
}

// Dessiner le joueur
function drawPlayer() {
    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    
    ctx.fillStyle = player.color;
    ctx.fillRect(screenX, screenY, player.width, player.height);
    
    // Yeux
    ctx.fillStyle = '#FFF';
    if (player.facingRight) {
        ctx.fillRect(screenX + 20, screenY + 8, 8, 8);
    } else {
        ctx.fillRect(screenX + 4, screenY + 8, 8, 8);
    }
}

// Dessiner les plateformes
function drawPlatforms() {
    platforms.forEach(platform => {
        // Ne dessiner que si visible à l'écran
        if (platform.x + platform.width < camera.x || platform.x > camera.x + canvas.width) {
            return;
        }
        
        // Animation de saut des blocs
        if (platform.bounceOffset !== undefined && platform.bounceOffset !== 0) {
            platform.bounceOffset += 1;
            if (platform.bounceOffset >= 0) {
                platform.bounceOffset = 0;
            }
        }
        
        const bounceY = platform.bounceOffset || 0;
        const screenX = platform.x - camera.x;
        const screenY = platform.y - camera.y + bounceY;
        
        ctx.fillStyle = platform.color;
        ctx.fillRect(screenX, screenY, platform.width, platform.height);
        
        // Détails pour les tuyaux
        if (platform.type === 'pipe') {
            ctx.strokeStyle = '#006400';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX, screenY, platform.width, platform.height);
            ctx.strokeRect(screenX + 5, screenY - 5, platform.width - 10, 10);
        }
        
        // Détails pour les blocs
        if (platform.type === 'block' || platform.type === 'coin-block') {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX, screenY, platform.width, platform.height);
            ctx.strokeRect(screenX + 4, screenY + 4, platform.width - 8, platform.height - 8);
        }
        
        // Drapeau
        if (platform.type === 'flag-pole') {
            ctx.fillStyle = '#000';
            ctx.fillRect(screenX, screenY, platform.width, platform.height);
        }
        
        if (platform.type === 'flag') {
            // Triangle de drapeau
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(screenX + platform.width, screenY + platform.height / 2);
            ctx.lineTo(screenX, screenY + platform.height);
            ctx.fill();
        }
    });
}

// Dessiner les ennemis
function drawEnemies() {
    enemies.forEach(enemy => {
        if (!enemy.alive) return;
        if (enemy.x + enemy.width < camera.x || enemy.x > camera.x + canvas.width) return;
        
        const screenX = enemy.x - camera.x;
        const screenY = enemy.y - camera.y;
        
        ctx.fillStyle = enemy.color;
        ctx.fillRect(screenX, screenY, enemy.width, enemy.height);
        
        // Yeux
        ctx.fillStyle = '#FFF';
        ctx.fillRect(screenX + 6, screenY + 8, 8, 8);
        ctx.fillRect(screenX + 18, screenY + 8, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + 8, screenY + 10, 4, 4);
        ctx.fillRect(screenX + 20, screenY + 10, 4, 4);
    });
}

// Dessiner les pièces
function drawCoins() {
    coinItems.forEach(coin => {
        if (coin.collected) return;
        if (coin.x + coin.width < camera.x || coin.x > camera.x + canvas.width) return;
        
        const screenX = coin.x - camera.x;
        const screenY = coin.y - camera.y;
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(screenX + coin.width / 2, screenY + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Dessiner les infos du jeu sur le canvas
function drawGameInfo() {
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    // MARIO (score)
    ctx.fillText('MARIO', 20, 25);
    ctx.fillText(score.toString().padStart(6, '0'), 20, 45);
    
    // COINS
    ctx.fillText('○×' + coins.toString().padStart(2, '0'), 150, 45);
    
    // WORLD
    ctx.fillText('WORLD', 280, 25);
    ctx.fillText(currentWorld + '-' + currentLevel, 280, 45);
    
    // TIME
    ctx.fillText('TIME', 400, 25);
    ctx.fillText(time.toString(), 400, 45);
    
    // LIVES
    ctx.fillText('LIVES', 520, 25);
    ctx.fillText('×' + lives, 520, 45);
}

// Dessiner le décor
function drawBackground() {
    // Ciel
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Nuages (positionnés dans le monde)
    ctx.fillStyle = '#FFF';
    const clouds = [150, 450, 650, 900, 1200, 1500, 1800, 2100, 2400, 2700];
    clouds.forEach(x => {
        if (x > camera.x - 100 && x < camera.x + canvas.width + 100) {
            drawCloud(x, 80 + Math.sin(x / 200) * 20);
        }
    });
    
    // Buissons (positionnés dans le monde)
    ctx.fillStyle = '#00AA00';
    const bushes = [200, 550, 800, 1100, 1400, 1700, 2000, 2300, 2600];
    bushes.forEach(x => {
        if (x > camera.x - 50 && x < camera.x + canvas.width + 50) {
            drawBush(x, 410);
        }
    });
}

function drawCloud(x, y) {
    const screenX = x - camera.x;
    const screenY = y - camera.y;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, 20, 0, Math.PI * 2);
    ctx.arc(screenX + 20, screenY, 25, 0, Math.PI * 2);
    ctx.arc(screenX + 40, screenY, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawBush(x, y) {
    const screenX = x - camera.x;
    const screenY = y - camera.y;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, 15, 0, Math.PI * 2);
    ctx.arc(screenX + 15, screenY - 5, 15, 0, Math.PI * 2);
    ctx.arc(screenX + 30, screenY, 15, 0, Math.PI * 2);
    ctx.fill();
}

// Mise à jour de l'interface
function updateUI() {
    document.getElementById('score').textContent = score.toString().padStart(6, '0');
    document.getElementById('coins').textContent = '×' + coins.toString().padStart(2, '0');
    document.getElementById('lives').textContent = '×' + lives;
    document.getElementById('time').textContent = time;
}

// Réinitialiser la position du joueur
function resetPlayerPosition() {
    player.x = 100;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
}

// Fin de niveau
function completeLevel() {
    if (!levelComplete) {
        levelComplete = true;
        player.velocityX = 0;
        
        // Bonus de temps
        const timeBonus = time * 50;
        score += timeBonus;
        
        updateUI();
    }
}

// Passer au niveau suivant
function nextLevel() {
    currentLevel++;
    if (currentLevel > 4) {
        currentLevel = 1;
        currentWorld++;
    }
    
    levelComplete = false;
    levelTransition = false;
    time = 400;
    
    // Générer le nouveau niveau
    generateLevel(currentWorld, currentLevel);
    
    resetPlayerPosition();
    camera.x = 0;
    camera.y = 0;
    
    updateUI();
}

// Fin de jeu
function endGame() {
    gameOver = true;
    document.getElementById('game-over').classList.remove('hidden');
}

// Recommencer le jeu
function restartGame() {
    gameOver = false;
    levelComplete = false;
    levelTransition = false;
    transitionTimer = 0;
    currentWorld = 1;
    currentLevel = 1;
    score = 0;
    coins = 0;
    lives = 3;
    time = 400;
    
    // Générer le niveau 1-1
    generateLevel(currentWorld, currentLevel);
    
    resetPlayerPosition();
    
    // Réinitialiser la caméra
    camera.x = 0;
    camera.y = 0;
    
    // Réinitialiser les ennemis
    enemies.forEach(enemy => {
        enemy.alive = true;
        enemy.x = enemy.x > 500 ? 650 : 400;
    });
    
    // Réinitialiser les pièces
    coinItems.forEach(coin => {
        coin.collected = false;
    });
    
    // Réinitialiser les blocs à pièces
    platforms.forEach(platform => {
        if (platform.type === 'coin-block') {
            platform.color = '#FFD700';
        }
    });
    
    document.getElementById('game-over').classList.add('hidden');
    updateUI();
}

// Timer
setInterval(() => {
    if (!gameOver && time > 0) {
        time--;
        updateUI();
        if (time === 0) {
            lives--;
            if (lives <= 0) {
                endGame();
            } else {
                resetPlayerPosition();
                time = 400;
            }
        }
    }
}, 1000);

// Dessiner l'écran de transition
function drawTransition() {
    ctx.fillStyle = 'rgba(0, 0, 0, ' + Math.min(transitionTimer / 60, 1) + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (transitionTimer > 30) {
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('WORLD ' + currentWorld + '-' + (currentLevel + 1), canvas.width / 2, canvas.height / 2);
        ctx.font = 'bold 16px Arial';
        ctx.fillText('× ' + lives, canvas.width / 2, canvas.height / 2 + 40);
    }
}

// Boucle de jeu principale
function gameLoop() {
    if (levelTransition) {
        transitionTimer++;
        if (transitionTimer > 120) {
            nextLevel();
        }
        
        // Dessiner
        drawBackground();
        drawPlatforms();
        drawCoins();
        drawEnemies();
        drawPlayer();
        drawGameInfo();
        drawTransition();
    } else if (!gameOver && !levelComplete) {
        updatePlayer();
        updateEnemies();
        
        // Dessiner
        drawBackground();
        drawPlatforms();
        drawCoins();
        drawEnemies();
        drawPlayer();
        drawGameInfo();
    } else if (levelComplete) {
        // Animation de fin de niveau
        const flagPole = platforms.find(p => p.type === 'flag-pole');
        if (flagPole && player.y < flagPole.y + flagPole.height - player.height - 5) {
            player.y += 3;
        } else {
            // Une fois en bas, démarrer la transition
            if (!levelTransition) {
                levelTransition = true;
                transitionTimer = 0;
            }
        }
        
        // Dessiner
        drawBackground();
        drawPlatforms();
        drawCoins();
        drawEnemies();
        drawPlayer();
        drawGameInfo();
    } else if (gameOver) {
        // Dessiner
        drawBackground();
        drawPlatforms();
        drawCoins();
        drawEnemies();
        drawPlayer();
        drawGameInfo();
    }
    
    requestAnimationFrame(gameLoop);
}

// D\u00e9marrer le jeu
generateLevel(currentWorld, currentLevel);
updateUI();
gameLoop();
