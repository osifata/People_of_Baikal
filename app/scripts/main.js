let checkInterval;
let lastAnswer = "";
let selectedVoice = null;
let isWaitingForResponse = false;
let activeMarker = null; // Храним активный маркер

initialize().then(() => {
    console.log("Initialization complete");
    if (checkInterval) clearInterval(checkInterval);

    // Отправляем пустой запрос при инициализации
    submitQuestion(" ");

    checkInterval = setInterval(async () => {
        console.log("Checking for new messages...");
        const data = await fetchMessages(conversationid, userid);
        if (data.st && data.ms.answer !== lastAnswer) {
            if (isWaitingForResponse) {
                console.log("New answer received:", data.ms.answer);
                await updateText(data.ms.answer);
                // highlightModelsBasedOnQuery(data.ms.answer);
                isWaitingForResponse = false;
            }
        }
    }, 5000);

    // Добавляем обработчики событий для маркеров
    setupMarkerListeners();
}).catch(error => {
    console.error("Initialization failed:", error);
});

function setupMarkerListeners() {
    const markerLegends = document.getElementById("marker-legends");
    const markerEvenk = document.getElementById("marker-evenk");
    const markerTof = document.getElementById("marker-tof");
    const markerBur = document.getElementById("marker-buryat");
    const markerNature = document.getElementById("marker-nature");
    const markerSecurity = document.getElementById("marker-security");
    const markerFacts = document.getElementById("marker-facts");

    if (markerLegends) {
        markerLegends.addEventListener("markerFound", () => {
            console.log("Marker 'legends' found");
            activeMarker = "marker-legends";
        });
        markerLegends.addEventListener("markerLost", () => {
            console.log("Marker 'legends' lost");
            if (activeMarker === "marker-legends") {
                activeMarker = null;
            }
        });
        
    }

    if (markerEvenk) {
        markerEvenk.addEventListener("markerFound", () => {
            console.log("Marker 'evenk' found");
            activeMarker = "marker-evenk";
        });
        markerEvenk.addEventListener("markerLost", () => {
            console.log("Marker 'evenk' lost");
            if (activeMarker === "marker-evenk") {
                activeMarker = null;
            }
        });
    }

    if (markerTof) {
        markerTof.addEventListener("markerFound", () => {
            console.log("Marker 'tof' found");
            activeMarker = "marker-tof";
        });
        markerTof.addEventListener("markerLost", () => {
            console.log("Marker 'tof' lost");
            if (activeMarker === "marker-tof") {
                activeMarker = null;
            }
        });
    }

    if (markerBur) {
        markerBur.addEventListener("markerFound", () => {
            console.log("Marker 'buryat' found");
            activeMarker = "marker-buryat";
        });
        markerBur.addEventListener("markerLost", () => {
            console.log("Marker 'buryat' lost");
            if (activeMarker === "marker-buryat") {
                activeMarker = null;
            }
        });
    }

    if (markerSecurity) {
        markerSecurity.addEventListener("markerFound", () => {
            console.log("Marker 'security' found");
            activeMarker = "marker-security";
        });
        markerSecurity.addEventListener("markerLost", () => {
            console.log("Marker 'security' lost");
            if (activeMarker === "marker-security") {
                activeMarker = null;
            }
        });
    }

    if (markerNature) {
        markerNature.addEventListener("markerFound", () => {
            console.log("Marker 'nature' found");
            activeMarker = "marker-nature";
        });
        markerNature.addEventListener("markerLost", () => {
            console.log("Marker 'nature' lost");
            if (activeMarker === "marker-nature") {
                activeMarker = null;
            }
        });
    }

    if (markerFacts) {
        markerFacts.addEventListener("markerFound", () => {
            console.log("Marker 'facts' found");
            activeMarker = "marker-facts";
        });
        markerFacts.addEventListener("markerLost", () => {
            console.log("Marker 'facts' lost");
            if (activeMarker === "marker-facts") {
                activeMarker = null;
            }
        });
    }
}

function getRoleByMarker(markerId) {
    switch(markerId) {
        case 'marker-legends':
            return 'legend';
        case 'marker-evenk':
            return 'evenk';
        case 'marker-tof':
            return 'tof';
        case 'marker-buryat':
            return 'buryat';
        case 'marker-nature':
            return 'nature';
        case 'marker-security':
            return 'sec';
        case 'marker-facts':
            return 'fact';
        default:
            return null;
    }
}

async function submitQuestion(question = "") {
    console.log("submitQuestion called");
    const questionInput = document.getElementById("questionInput");
    const questionText = question || questionInput.value;

    if (!questionText) {
        console.log("Question is empty");
        return;
    }

    // Останавливаем текущее воспроизведение и очищаем очередь
    stopSpeaking();

    // Устанавливаем флаг, что мы ждем новый ответ
    isWaitingForResponse = true;

    const role = getRoleByMarker(activeMarker);
    const fullQuestion = role ? `${questionText};${role}` : questionText;

    // Подсветка моделей на основе запроса пользователя
    highlightModelsBasedOnQuery(questionText); // <-- Подсветка только на основе запроса пользователя

    console.log("Sending question:", fullQuestion);
    const response = await submit(fullQuestion, userid, conversationid);
    console.log("Response from submit:", response);

    if (response.status) {
        console.log("Question submitted successfully");
        questionInput.value = "";
    } else {
        console.error("Failed to submit question");
    }
}


async function updateText(text) {
    console.log("Updating text to:", text);
    const answerText = document.getElementById("answerText");

    if (text === lastAnswer) {
        console.log("Ответ не изменился, пропускаем воспроизведение.");
        return;
    }

    answerText.innerText = text;
    lastAnswer = text;

    // Рассчитываем приблизительное время речи (в секундах)
    const wordCount = text.split(/\s+/).length;
    const speechDuration = Math.max(2, wordCount * 0.5); // ~0.5 сек на слово, минимум 2 сек

    // Управление анимацией для моделей
    const models = [
        { id: "model_legenda", baseAnimation: "idle" },
        { id: "model_evenk", baseAnimation: "stand" },
        { id: "model_tofala", baseAnimation: "idle" },
        { id: "model_buryat", baseAnimation: "idle" },
        { id: "model_nature", baseAnimation: "idle" },
        { id: "model_facts", baseAnimation: "avaturn_animation" },
        { id: "model_sec", baseAnimation: "idle" }
    ];

    models.forEach(model => {
        const modelToAnimate = document.getElementById(model.id);
        if (!modelToAnimate) return;

        const animationMixer = modelToAnimate.components["animation-mixer"];
        if (!animationMixer) return;

        if (text && text !== "Waiting for response...") {
            // 1. Останавливаем текущую анимацию
            modelToAnimate.removeAttribute("animation-mixer");
            
            // 2. Запускаем анимацию talk с рассчитанной длительностью
            modelToAnimate.setAttribute("animation-mixer", {
                clip: "talk",
                loop: "repeat",
                timeScale: calculateTimeScale(model.id, speechDuration)
            });

            console.log(`Анимация talk для ${model.id}, длительность: ${speechDuration} сек`);
        } else {
            // Возврат к базовой анимации
            modelToAnimate.setAttribute("animation-mixer", {
                clip: model.baseAnimation,
                loop: "repeat"
            });
        }
    });

    // Воспроизводим речь с синхронизацией
    await speakTextWithSync(text, speechDuration);

    // После завершения речи возвращаем базовые анимации
    models.forEach(model => {
        const modelEl = document.getElementById(model.id);
        if (modelEl) {
            modelEl.setAttribute("animation-mixer", {
                clip: model.baseAnimation,
                loop: "repeat"
            });
        }
    });
}

// Расчет скорости анимации для синхронизации с речью
function calculateTimeScale(modelId, duration) {
    // Стандартная длительность анимации talk для разных моделей
    const modelDurations = {
        "model_legenda": 3.0,
        "model_evenk": 2.5,
        "model_tof": 2.5,
        "model_buryat": 2.5,
        "model_nature": 3.2,
        "model_facts": 4.0,
        "model_sec": 3.5
    };
    
    const baseDuration = modelDurations[modelId] || 3.0;
    return baseDuration / duration; // Корректируем speed анимации
}

// Модифицированная функция speakText с синхронизацией
function speakTextWithSync(text, duration) {
    return new Promise((resolve) => {
        stopSpeaking();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';

        // Настройка голоса (как в вашем коде)
        const currentPage = window.location.pathname.split('/').pop();
        const isScientistPage = currentPage === 'scientist_facts.html' || currentPage === 'scientist_nature.html' || currentPage === 'tofalar.html';

        if (isScientistPage) {
            const dmitryVoice = voices.find(voice => 
                voice.name === "Microsoft Dmitry Online (Natural) - Russian (Russia)" ||
                voice.name.includes("Dmitry") && voice.name.includes("Microsoft")
            );
            if (dmitryVoice) utterance.voice = dmitryVoice;
        } else if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Корректируем скорость речи для точной синхронизации
        const wordCount = text.split(/\s+/).length;
        const idealDuration = wordCount * 0.5;
        utterance.rate = Math.min(2, Math.max(0.5, duration / idealDuration));

        utterance.onend = () => {
            console.log("Речь завершена");
            resolve();
        };

        utterance.onerror = (event) => {
            console.error("Ошибка воспроизведения:", event);
            resolve();
        };

        window.speechSynthesis.speak(utterance);
    });
}

let voices = [];

// Функция для загрузки доступных голосов
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        console.log("Голоса еще не загружены, попробуйте снова.");
        setTimeout(loadVoices, 100);
        return;
    }
    console.log("Доступные голоса:", voices);

    // Определяем текущую страницу
    const currentPage = window.location.pathname.split('/').pop();
    const isScientistPage = currentPage === 'scientist_facts.html' || currentPage === 'scientist_nature.html';

    if (isScientistPage) {
        // Для scientist_facts и scientist_nature используем мужской голос Дмитрия
        const dmitryVoice = voices.find(voice => 
            voice.name === "Microsoft Dmitry Online (Natural) - Russian (Russia)" ||
            voice.name.includes("Dmitry") && voice.name.includes("Microsoft")
        );
        
        if (dmitryVoice) {
            selectedVoice = dmitryVoice;
            console.log("Установлен мужской голос: Microsoft Dmitry");
        } else {
            console.warn("Голос Microsoft Dmitry не найден. Будет использован голос по умолчанию.");
            setDefaultVoice();
        }
    } else {
        // Для всех остальных страниц используем Светлану по умолчанию
        setDefaultVoice();
    }
}

function setDefaultVoice() {
    const svetlanaVoice = voices.find(voice => 
        voice.name === "Microsoft Svetlana Online (Natural) - Russian (Russia)" ||
        voice.name.includes("Svetlana") && voice.name.includes("Microsoft")
    );
    
    if (svetlanaVoice) {
        selectedVoice = svetlanaVoice;
        console.log("Установлен голос по умолчанию: Microsoft Svetlana");
    } else {
        console.warn("Голос Microsoft Svetlana не найден. Используется системный голос по умолчанию.");
        // Если ни один из нужных голосов не найден, используем первый доступный русский голос
        const russianVoice = voices.find(voice => voice.lang === 'ru-RU');
        if (russianVoice) {
            selectedVoice = russianVoice;
            console.log("Используется первый найденный русский голос:", russianVoice.name);
        }
    }
}

// Событие, которое срабатывает, когда голоса загружены
window.speechSynthesis.onvoiceschanged = loadVoices;

// Вызов вручную на случай, если голоса уже загружены
loadVoices();

function speakText(text) {
    stopSpeaking(); // Останавливаем текущее воспроизведение

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';

    // Для scientist_facts и scientist_nature принудительно используем мужской голос
    const currentPage = window.location.pathname.split('/').pop();
    const isScientistPage = currentPage === 'scientist_facts.html' || currentPage === 'scientist_nature.html';

    if (isScientistPage) {
        const dmitryVoice = voices.find(voice => 
            voice.name === "Microsoft Dmitry Online (Natural) - Russian (Russia)" ||
            voice.name.includes("Dmitry") && voice.name.includes("Microsoft")
        );
        
        if (dmitryVoice) {
            utterance.voice = dmitryVoice;
            console.log("Принудительно используется мужской голос: Microsoft Dmitry");
        }
    } else if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
    console.log("Произношение нового ответа: " + text + ". Голос: " + (utterance.voice ? utterance.voice.name : "по умолчанию"));
}

function stopSpeaking() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel(); // Останавливаем и очищаем очередь
        console.log("Произношение остановлено и очередь очищена.");
    }
}