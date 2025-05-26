const microphoneButton = document.querySelector('.microphone-button');
let recognition;

function startRecording() {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      console.error("Ваш браузер не поддерживает SpeechRecognition API.");
      return;
    }
  
    microphoneButton.classList.add('recording');
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = function(event) {
      const speechResult = event.results[0][0].transcript;
      console.log("Recognized speech: " + speechResult);
      submitQuestion(speechResult);
    };
  
    recognition.onspeechend = function() {
      recognition.stop();
      microphoneButton.classList.remove('recording');
    };
  
    recognition.onerror = function(event) {
      console.error("Recognition error:", event.error);
      microphoneButton.classList.remove('recording');
  
      if (event.error === 'network') {
        console.error("Ошибка сети. Проверьте подключение к интернету.");
      } else if (event.error === 'not-allowed') {
        console.error("Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.");
      } else if (event.error === 'no-speech') {
        console.error("Речь не обнаружена. Проверьте микрофон.");
      } else {
        console.error("Неизвестная ошибка:", event.error);
      }
    };
  
    recognition.onstart = function() {
      console.log("Распознавание речи начато.");
    };
  
    recognition.onend = function() {
      console.log("Распознавание речи завершено.");
    };
  }

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
    microphoneButton.classList.remove('recording');
}

microphoneButton.addEventListener('mousedown', startRecording);
microphoneButton.addEventListener('mouseup', stopRecording);
microphoneButton.addEventListener('touchstart', startRecording);
microphoneButton.addEventListener('touchend', stopRecording);