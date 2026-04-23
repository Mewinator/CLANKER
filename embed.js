const checkbox = document.getElementById('checkbox');
const checkboxContainer = document.getElementById('checkbox-container');
const status = document.getElementById('status');
const modal = document.querySelector('dialog');
const promptName = document.getElementById('prompt');
const main = document.querySelector('main');
let currentPrompt;
let userAnswer;
let userLine = [];
let drawing = false;

function verified() {
    modal.close();
    checkboxContainer.innerHTML = '<span class="material-symbols-outlined checkmark">check</span>';
    status.textContent = 'Verified';
}
function notVerified() {
    modal.close();
    checkboxContainer.innerHTML = '<span class="material-symbols-outlined wrong">close</span>';
    status.textContent = 'Unverified';
    checkbox.checked = false;
}
checkboxContainer.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        checkboxContainer.innerHTML = '<div class="loader"></div>';
        checkboxContainer.style.border = 'none';
        status.textContent = 'Checking...';
        openModal();
    } else {
        checkboxContainer.innerHTML = '';
        checkboxContainer.style.borderColor = 'var(--text)';
        status.textContent = "I'm not a human";
    }
});
function isLight() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("theme") && searchParams.get("theme") === "light") {
        document.documentElement.style.setProperty('--bg', '#ddeeee');
        document.documentElement.style.setProperty('--border', '#999999');
        document.documentElement.style.setProperty('--content', '#d0dddd');
        document.documentElement.style.setProperty('--text', '#333');
    }
}
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
const rgbToHex = (r, g, b) => "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');
function openModal() {
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    main.innerHTML = '';
    userAnswer = null;
    userLine = [];
    if (currentPrompt.type === 'cursor-line') {
        const template = document.getElementById('cursor-line-template').content.cloneNode(true);
        main.appendChild(template);
        const canvas = document.getElementById('cursor-canvas');
        const ctx = canvas.getContext('2d');
        const startPoint = { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20 };
        const endPoint = { x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * (canvas.height - 40) + 20 };
        currentPrompt.answer = { startPoint, endPoint };
        promptName.textContent = `Draw a straight line from the green circle to the red circle.`;
        const drawPoints = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#27ae60';
            ctx.beginPath();
            ctx.arc(startPoint.x, startPoint.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#c0392b';
            ctx.beginPath();
            ctx.arc(endPoint.x, endPoint.y, 10, 0, 2 * Math.PI);
            ctx.fill();
        };
        drawPoints();
        const getMousePos = (evt) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        canvas.addEventListener('mousedown', (e) => {
            drawing = true;
            userLine = [getMousePos(e)];
        });
        canvas.addEventListener('mousemove', (e) => {
            if (drawing) {
                const pos = getMousePos(e);
                ctx.beginPath();
                ctx.moveTo(userLine[userLine.length - 1].x, userLine[userLine.length - 1].y);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = 'var(--text)';
                ctx.lineWidth = 2;
                ctx.stroke();
                userLine.push(pos);
            }
        });
        canvas.addEventListener('mouseup', () => {
            drawing = false;
        });
        document.getElementById('reset-canvas').addEventListener('click', () => {
            drawPoints();
            userLine = [];
        });
    } else if (currentPrompt.type === 'box-select') {
        const template = document.getElementById('box-select-template').content.cloneNode(true);
        main.appendChild(template);
        const grid = document.getElementById('box-grid');
        promptName.textContent = currentPrompt.name;
        if (currentPrompt.options) {
            for (const option of currentPrompt.options) {
                const box = document.createElement('div');
                box.style.width = '80px';
                box.style.height = '80px';
                box.style.cursor = 'pointer';
                box.style.display = 'flex';
                box.style.justifyContent = 'center';
                box.style.alignItems = 'center';
                box.style.border = '1px solid var(--border)';
                box.textContent = option;
                box.addEventListener('click', () => {
                    userAnswer = option;
                    Array.from(grid.children).forEach(child => child.style.border = '1px solid var(--border)');
                    box.style.border = '2px solid #fff';
                });
                grid.appendChild(box);
            }
        } else {
            const oddOneOutIndex = Math.floor(Math.random() * 9);
            currentPrompt.answer = oddOneOutIndex;
            const baseColorHex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            const baseRgb = hexToRgb(baseColorHex);
            let differentRgb = { ...baseRgb };
            const change = 10;
            if (baseRgb.r < change && baseRgb.g < change && baseRgb.b < change) {
                differentRgb.r += change;
                differentRgb.g += change;
                differentRgb.b += change;
            } else {
                differentRgb.r = Math.max(0, differentRgb.r - change);
                differentRgb.g = Math.max(0, differentRgb.g - change);
                differentRgb.b = Math.max(0, differentRgb.b - change);
            }
            const differentColorHex = rgbToHex(differentRgb.r, differentRgb.g, differentRgb.b);
            for (let i = 0; i < 9; i++) {
                const box = document.createElement('div');
                box.style.width = '80px';
                box.style.height = '80px';
                box.style.cursor = 'pointer';
                box.style.backgroundColor = (i === oddOneOutIndex) ? differentColorHex : baseColorHex;
                box.addEventListener('click', () => {
                    userAnswer = i;
                    Array.from(grid.children).forEach(child => child.style.border = 'none');
                    box.style.border = '2px solid #fff';
                });
                grid.appendChild(box);
            }
        }
    } else {
        promptName.textContent = currentPrompt.name;
        const template = document.getElementById('input-template').content.cloneNode(true);
        main.appendChild(template);
    }
    if (currentPrompt.timer) {
        const timerTemplate = document.getElementById('timer-template').content.cloneNode(true);
        main.appendChild(timerTemplate);
        const timerDisplay = document.getElementById('timer-display');
        let timeLeft = currentPrompt.timer;
        const timerId = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerId);
                notVerified();
            }
        }, 1000);
    }
    modal.showModal();
}
function verify() {
    if (currentPrompt.type === 'cursor-line') {
        if (userLine.length < 2) return notVerified();
        const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        const startCorrect = dist(userLine[0], currentPrompt.answer.startPoint) < 15;
        const endCorrect = dist(userLine[userLine.length - 1], currentPrompt.answer.endPoint) < 15;
        if (!startCorrect || !endCorrect) return notVerified();
        let totalDistance = 0;
        for(let i = 0; i < userLine.length; i++) {
            const pt = userLine[i];
            const { startPoint, endPoint } = currentPrompt.answer;
            const num = Math.abs((endPoint.y - startPoint.y) * pt.x - (endPoint.x - startPoint.x) * pt.y + endPoint.x * startPoint.y - endPoint.y * startPoint.x);
            const den = dist(startPoint, endPoint);
            totalDistance += num / den;
        }
        const avgDistance = totalDistance / userLine.length;
        if (avgDistance < 2) {
            verified();
        } else {
            notVerified();
        }
    } else if (currentPrompt.type === 'box-select') {
        if (userAnswer === currentPrompt.answer) {
            verified();
        } else {
            notVerified();
        }
    } else {
        const input = document.getElementById('answer-input');
        if (input && input.value.toLowerCase() === currentPrompt.answer.toLowerCase()) {
            verified();
        } else {
            notVerified();
        }
    }
}
const prompts = [
    {
        "id": "cursor-move-hard",
        "name": "Draw a straight line between the two circles.",
        "type": "cursor-line",
        "timer": 20
    },
    {
        "id": "spot-the-difference-hard",
        "name": "Which box has a slightly different color?",
        "type": "box-select"
    },
    {
        "id": "calculus-hard",
        "name": "Solve: ∫(e^x * sin(x))dx",
        "answer": "(e^x * (sin(x) - cos(x))) / 2 + C",
        "timer": 45
    },
    {
        "id": "pi-digit-hard",
        "name": "What is the 7,654th digit of pi?",
        "answer": "8",
        "timer": 30
    },
    {
        "id": "fibonacci-hard",
        "name": "What is the 30th number in the Fibonacci sequence?",
        "answer": "832040",
        "timer": 25
    },
    {
        "id": "factorial-hard",
        "name": "What is 20! (20 factorial)?",
        "answer": "2432902008176640000",
        "timer": 35
    },
    {
        "id": "single-element",
        "name": "Find the element that appears only once: 9, 4, 8, 4, 9, 2, 8",
        "answer": "2",
        "options": ["9", "4", "8", "2"],
        "type": "box-select"
    },
    {
        "id": "system-of-equations",
        "name": "Solve for x and y: 2x + 3y = 7, 5x - y = 9",
        "answer": "x=2, y=1",
        "timer": 40
    },
    {
        "id": "regex-match",
        "name": "Which of the following strings is matched by the regex: /^[a-z]{3,5}[0-9]{2}$/",
        "answer": "abcde12",
        "options": ["ab123", "abcde12", "abcdef1", "ab1"],
        "type": "box-select"
    }
];
isLight();