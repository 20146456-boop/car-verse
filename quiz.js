
/* ==========================================================================
   QUIZ CAR VERSE — 10 preguntas basadas en el contenido de index.html
   La primera opción de cada pregunta es la correcta; el código mezcla
   el orden de las opciones cada vez que se muestra la pregunta.
   ========================================================================== */
const quizData = [
    {
        question: "¿Quién patentó en 1886 el Benz Patent-Motorwagen, considerado el primer automóvil con motor de combustión interna?",
        options: ["Karl Benz", "Henry Ford", "Ferdinand Porsche", "Enzo Ferrari"],
        explanation: "Karl Benz patentó en 1886 el primer automóvil impulsado por un motor de combustión interna."
    },
    {
        question: "En 1908, Henry Ford presentó el Model T junto con una innovación que democratizó el transporte. ¿Cuál fue?",
        options: ["La línea de ensamblaje móvil", "El motor turbo", "La tracción total", "El motor híbrido"],
        explanation: "La línea de ensamblaje móvil permitió producir autos en masa y a menor costo."
    },
    {
        question: "¿Qué tipo de motores caracterizaron a los Muscle Cars y Gran Turismo de los años 60?",
        options: ["V8 de gran cilindrada", "Motores de vapor", "Motores eléctricos de batería", "Diésel de 4 cilindros"],
        explanation: "En los 60 surgieron íconos con motores V8 de gran cilindrada en América y Europa."
    },
    {
        question: "¿Qué país revolucionó la industria en los años 90 con motores turboalimentados y plataformas como ATTESA, 2JZ y RB26?",
        options: ["Japón", "Alemania", "Italia", "Estados Unidos"],
        explanation: "Japón lideró la era dorada Tuner & JDM con turbos avanzados y tracción total."
    },
    {
        question: "¿Qué tipo de tracción tienen los vehículos de la categoría Drifting?",
        options: [
            "Tracción trasera (RWD)",
            "Tracción delantera (FWD)",
            "Tracción total (AWD)",
            "Un motor eléctrico en cada rueda"
        ],
        explanation: "Los autos de drift son de tracción trasera, preparados para el sobreviraje y el derrape controlado."
    },
    {
        question: "¿Qué sistemas híbridos equipan a los monoplazas actuales de Fórmula 1?",
        options: ["MGU-K y MGU-H", "ABS y ESP", "Start-Stop y alternador", "Inyección directa y VVT"],
        explanation: "Los sistemas MGU-K y MGU-H recuperan energía y, junto al V6 turbo de 1.6L, forman el motor híbrido."
    },
    {
        question: "¿Qué potencia supera normalmente un Hypercar, la cúspide del rendimiento?",
        options: ["Más de 1000 HP", "Alrededor de 100 HP", "Unos 300 HP", "Unos 500 HP"],
        explanation: "Los Hypercars superan los 1000 HP y usan materiales compuestos para alcanzar velocidades extremas."
    },
    {
        question: "¿Qué motor lleva el Toyota Supra MK4 (A80)?",
        options: [
            "3.0L Twin-Turbo I6 (2JZ-GTE)",
            "4.0L Atmosférico B6",
            "7.0L Big Block V8",
            "8.0L Quad-Turbo W16"
        ],
        explanation: "El 2JZ-GTE es un 6 cilindros en línea de 3.0L con doble turbo, famoso por su enorme potencial de preparación."
    },
    {
        question: "¿Qué motor lleva el Nissan GT-R NISMO (R35) del catálogo?",
        options: [
            "3.8L V6 biturbo (VR38DETT)",
            "2.0L de 4 cilindros atmosférico",
            "5.0L V8 atmosférico",
            "3.0L Twin-Turbo I6 (2JZ-GTE)"
        ],
        explanation: "El GT-R R35 monta el VR38DETT: un V6 a 60° de 3.8L con doble turbo, famoso por su tracción integral y su aceleración."
    },
    {
        question: "¿Qué tipo de motor tiene el Porsche 911 GT3 Touring (992)?",
        options: [
            "Bóxer de 6 cilindros, 4.0L, atmosférico (sin turbo)",
            "V8 biturbo de 4.0L",
            "6 cilindros en línea de 3.0L con turbo",
            "V6 híbrido de 1.6L"
        ],
        explanation: "Es un bóxer de 6 cilindros y 4.0L, atmosférico y de altas revoluciones, que entrega 510 PS: la esencia de la línea GT3."
    }
];
 
/* ---------- Referencias al DOM ----------
   Si el HTML es una versión vieja y le faltan elementos, se crean aquí
   para que el quiz nunca se quede en "Cargando pregunta...". */
const $ = id => document.getElementById(id);
 
const quizCardEl = $("quizCard");
 
function ensure(id, tag, className, parent) {
    let node = $(id);
    if (!node && parent) {
        node = document.createElement(tag);
        node.id = id;
        node.className = className;
        parent.appendChild(node);
    }
    return node;
}
 
const el = {
    count: $("questionCount"),
    score: $("scoreText"),
    track: $("progressTrack"),
    fill: $("progressFill"),
    card: quizCardEl,
    question: $("quizQuestion"),
    options: $("quizOptions"),
    feedback: ensure("quizFeedback", "p", "quiz-feedback", quizCardEl),
    next: ensure("btnNext", "button", "btn-quiz", quizCardEl),
    results: $("quizResults"),
    finalScore: $("finalScoreText"),
    finalFeedback: $("resultsFeedback"),
    restart: $("btnRestart")
};
el.next.type = "button";
 
/* mostrar / ocultar funciona aunque el HTML use style="display:none" */
function setVisible(node, visible) {
    if (!node) return;
    node.hidden = !visible;
    node.style.display = visible ? "" : "none";
}
 
/* ---------- Estado ---------- */
let current = 0;
let score = 0;
 
/* ---------- Utilidades ---------- */
function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
 
/* Mueve la barra y el carrito. "done" = preguntas ya respondidas */
function updateProgress(done) {
    const p = done / quizData.length;
    if (el.track) {
        el.track.style.setProperty("--p", p);
        el.track.setAttribute("aria-valuenow", done);
    }
    if (el.fill) el.fill.style.width = (p * 100) + "%";
}
 
/* ---------- Flujo del quiz ---------- */
function showQuestion() {
    const q = quizData[current];
 
    el.count.textContent = `Pregunta ${current + 1} de ${quizData.length}`;
    el.score.textContent = `Puntos: ${score}`;
    el.question.textContent = q.question;
    el.options.innerHTML = "";
    setVisible(el.feedback, false);
    setVisible(el.next, false);
 
    // Se marca la correcta ANTES de mezclar
    const mixed = shuffle(q.options.map((text, i) => ({ text, correct: i === 0 })));
 
    mixed.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        btn.textContent = opt.text;
        btn.dataset.correct = opt.correct;
        btn.addEventListener("click", () => answer(btn));
        el.options.appendChild(btn);
    });
}
 
function answer(chosen) {
    const q = quizData[current];
    const isCorrect = chosen.dataset.correct === "true";
 
    if (isCorrect) score++;
 
    // Bloquear y colorear todas las opciones
    el.options.querySelectorAll(".quiz-option").forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.correct === "true") btn.classList.add("correct");
    });
    if (!isCorrect) chosen.classList.add("wrong");
 
    el.feedback.textContent = (isCorrect ? "¡Correcto! " : "Incorrecto. ") + q.explanation;
    setVisible(el.feedback, true);
    el.score.textContent = `Puntos: ${score}`;
 
    // El carrito avanza al responder
    updateProgress(current + 1);
 
    el.next.textContent = current === quizData.length - 1 ? "Ver resultados" : "Siguiente pregunta";
    setVisible(el.next, true);
    el.next.focus();
}
 
function nextQuestion() {
    current++;
    if (current < quizData.length) {
        showQuestion();
    } else {
        showResults();
    }
}
 
function showResults() {
    setVisible(el.card, false);
    setVisible(el.results, true);
    el.count.textContent = "Quiz completado";
    el.finalScore.textContent = `Obtuviste ${score} de ${quizData.length} puntos`;
 
    let msg;
    if (score === quizData.length) {
        msg = "¡Perfecto! Eres un verdadero experto en el universo automotriz.";
    } else if (score >= 8) {
        msg = "¡Excelente! Conoces muy bien la plataforma Car Verse.";
    } else if (score >= 5) {
        msg = "Buen trabajo. Repasa la historia y el catálogo para mejorar tu puntaje.";
    } else {
        msg = "Sigue explorando la enciclopedia y vuelve a intentarlo.";
    }
    el.finalFeedback.textContent = msg;
}
 
function restart() {
    current = 0;
    score = 0;
    updateProgress(0);
    setVisible(el.results, false);
    setVisible(el.card, true);
    showQuestion();
}
 
/* ---------- Inicio ---------- */
el.next.addEventListener("click", nextQuestion);
if (el.restart) el.restart.addEventListener("click", restart);
updateProgress(0);
showQuestion();