document.getElementById('pooButton').addEventListener('click', function() {
    document.getElementById('fartSound').play();
    createPooEmojis();
});

function createPooEmojis() {
    for (let i = 0; i < 30; i++) {
        const poo = document.createElement('div');
        poo.className = 'pooEmoji';
        poo.innerText = '💩';
        poo.style.left = `${Math.random() * 100}vw`;
        poo.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(poo);
        setTimeout(() => poo.remove(), 5000);
    }
}
