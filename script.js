// SCORM setup
const scorm = pipwerks.SCORM;
scorm.version = "1.2";
let startTime;
let isScormActive = false;

// Global variables
let currentSlide = 0;
let currentQuiz = 0;
let courseData = {};
let quizScore = 0;
let totalQuestions = 0;

// Fetch and load config.json
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        courseData = data;
        totalQuestions = courseData.quiz.questions.length;
        courseData.quiz.questions.forEach(question => {
            question.correct = btoa(question.correct);
        });
        initCourse();
        document.getElementById('loading').remove();
    })
    .catch(error => {
        console.error('Error loading config:', error);
        document.getElementById('loading').remove();
    });

// Initialize course with SCORM
function initCourse() {
    if (courseData.theme) {
        document.documentElement.style.setProperty('--bs-primary', courseData.theme.primary || '#212529');
        document.documentElement.style.setProperty('--bs-secondary', courseData.theme.secondary || '#6c757d');
        document.documentElement.style.setProperty('--bs-gradient-start', courseData.theme.gradientStart || courseData.theme.primary || '#212529');
        document.documentElement.style.setProperty('--bs-gradient-end', courseData.theme.gradientEnd || courseData.theme.secondary || '#6c757d');
        document.documentElement.style.setProperty('--bs-background', courseData.theme.background || '#f8f9fa');
        document.documentElement.style.setProperty('--bs-text', courseData.theme.text || '#333');
        document.documentElement.style.setProperty('--bs-correct', courseData.theme.correct || '#28a745');
        document.documentElement.style.setProperty('--bs-incorrect', courseData.theme.incorrect || '#dc3545');
        document.documentElement.style.setProperty('--bs-title', courseData.theme.title || '#ffffff');
        document.documentElement.style.setProperty('--bs-sidebar', courseData.theme.sidebar || '#ffffff'); // Added
        document.documentElement.style.setProperty('--bs-card', courseData.theme.card || '#ffffff');     // Added
        const primary = courseData.theme.primary || '#212529';
        const hoverColor = darkenColor(primary, 0.2);
        document.documentElement.style.setProperty('--bs-primary-hover', hoverColor);
    }
    document.documentElement.style.setProperty('--base-font-size', courseData.fontSize || '1rem');

    const courseTitle = document.getElementById('course-title');
    courseTitle.textContent = courseData.title;
    document.title = courseData.title;

    isScormActive = scorm.init();
    if (isScormActive) {
        console.log("SCORM initialized successfully");
        startTime = new Date();
        let status = scorm.get("cmi.core.lesson_status");
        if (status === "not attempted" || status === "") {
            scorm.set("cmi.core.lesson_status", "incomplete");
        }
        scorm.save();
    } else {
        console.log("SCORM initialization failed. Running in standalone mode.");
    }

    const sidebar = document.getElementById('sidebar');
    if (courseData.sidebar) {
        sidebar.classList.remove('hidden');
        courseData.slides.forEach((slide, index) => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action';
            item.textContent = slide.title || `Slide ${index + 1}`;
            item.type = 'button';
            item.tabIndex = 0;
            item.setAttribute('aria-label', `Go to ${slide.title || `Slide ${index + 1}`}`);
            item.onclick = () => {
                currentSlide = index;
                currentQuiz = 0;
                renderSlide(currentSlide);
                sidebar.classList.remove('active');
                item.focus();
            };
            item.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            };
            sidebar.appendChild(item);
        });
    }

    renderSlide(currentSlide);

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            renderSlide(currentSlide);
        }
    });

    document.getElementById('exit-btn').classList.remove('hidden');
}

// Render slide content based on type
function renderSlide(index) {
    const slide = courseData.slides[index];
    const contentDiv = document.getElementById('slide-content');
    const slideContainer = document.getElementById('slide-container');
    const quizContainer = document.getElementById('quiz-container');
    const navigationDiv = document.getElementById('slide-container').querySelector('.navigation');

    if (quizContainer.classList.contains('hidden') === false) {
        quizContainer.classList.add('hidden');
        slideContainer.classList.remove('hidden');
    }

    contentDiv.style.opacity = '0';
    setTimeout(() => {
        contentDiv.innerHTML = '';

        if (slide.type === 'text') {
            contentDiv.innerHTML = `${slide.title ? `<h3>${slide.title}</h3>` : ''}<p>${slide.content}</p>`;
        } else if (slide.type === 'image') {
            contentDiv.innerHTML = `${slide.title ? `<h3>${slide.title}</h3>` : ''}<img src="${slide.src}" alt="${slide.alt || ''}"><p class="caption">${slide.caption || ''}</p>`;
        } else if (slide.type === 'checklist') {
            let checklistHTML = slide.title ? `<h3>${slide.title}</h3>` : '';
            checklistHTML += '<ul class="checklist">';
            slide.items.forEach(item => {
                checklistHTML += `<li>${item}</li>`;
            });
            checklistHTML += '</ul>';
            contentDiv.innerHTML = checklistHTML;
        } else if (slide.type === 'title-text') {
            contentDiv.innerHTML = `<h3>${slide.title}</h3><p>${slide.content}</p>`;
        } else if (slide.type === 'image-text') {
            contentDiv.innerHTML = `
                ${slide.title ? `<h3>${slide.title}</h3>` : ''}
                <div class="image-text">
                    <img src="${slide.src}" alt="${slide.alt || ''}">
                    <p>${slide.text}</p>
                </div>`;
        } else if (slide.type === 'quote') {
            contentDiv.innerHTML = `
                ${slide.title ? `<h3>${slide.title}</h3>` : ''}
                <blockquote class="quote">
                    <p>"${slide.content}"</p>
                    ${slide.author ? `<cite>— ${slide.author}</cite>` : ''}
                </blockquote>`;
        } else if (slide.type === 'video') {
            contentDiv.innerHTML = `
                <div class="video-container">
                    ${slide.title ? `<h3>${slide.title}</h3>` : ''}
                    <iframe src="${slide.src}" frameborder="0" allowfullscreen title="${slide.title || 'Video'}"></iframe>
                    ${slide.description ? `<p>${slide.description}</p>` : ''}
                </div>`;
        }

        contentDiv.style.opacity = '1';

        const prevBtn = document.getElementById('prev-btn');
        prevBtn.disabled = index === 0;
        prevBtn.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');

        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-btn';
        nextBtn.className = 'btn-next';
        nextBtn.textContent = index === courseData.slides.length - 1 ? 'Take Quiz' : 'Next';
        nextBtn.setAttribute('aria-label', index === courseData.slides.length - 1 ? 'Start Quiz' : 'Next Slide');
        nextBtn.onclick = () => {
            if (currentSlide < courseData.slides.length - 1) {
                currentSlide++;
                renderSlide(currentSlide);
            } else {
                showQuiz();
            }
        };

        navigationDiv.innerHTML = '';
        navigationDiv.appendChild(prevBtn);
        navigationDiv.appendChild(nextBtn);

        if (courseData.sidebar) {
            const sidebarItems = document.querySelectorAll('#sidebar .list-group-item');
            sidebarItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
                item.setAttribute('aria-current', i === index ? 'true' : 'false');
            });
        }

        if (isScormActive) {
            console.log(`Setting cmi.core.lesson_location to ${index}`);
            scorm.set("cmi.core.lesson_location", index.toString());
            scorm.save();
        }
    }, 50);
}

// Show quiz section
function showQuiz() {
    document.getElementById('slide-container').classList.add('hidden');
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.classList.remove('hidden');

    renderQuizQuestion(currentQuiz);
}

// Render individual quiz question
function renderQuizQuestion(index) {
    const quiz = courseData.quiz.questions[index];
    document.getElementById('quiz-question').textContent = quiz.question;

    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    quiz.options.forEach((option, optIndex) => {
        optionsDiv.innerHTML += `
            <label class="form-check">
                <input class="form-check-input" type="radio" name="quiz-${index}" value="${option}" id="option-${index}-${optIndex}" ${optIndex === 0 ? 'autofocus' : ''}>
                <span class="form-check-label">${option}</span>
            </label>
        `;
    });

    const feedbackDiv = document.getElementById('quiz-feedback');
    feedbackDiv.innerHTML = '';
    feedbackDiv.classList.remove('correct', 'incorrect', 'neutral');

    const quizContent = document.getElementById('quiz-container').querySelector('.quiz-content');
    let submitBtn = document.getElementById('submit-quiz');

    if (!submitBtn) {
        submitBtn = document.createElement('button');
        submitBtn.id = 'submit-quiz';
        submitBtn.className = 'btn-submit';
        quizContent.insertBefore(submitBtn, document.getElementById('exit-btn'));
    }
    submitBtn.textContent = index === totalQuestions - 1 ? 'Finish' : 'Submit';
    submitBtn.setAttribute('aria-label', index === totalQuestions - 1 ? 'Finish Quiz' : 'Submit Answer');
    submitBtn.onclick = () => {
        const selected = document.querySelector(`input[name="quiz-${index}"]:checked`);
        feedbackDiv.classList.remove('correct', 'incorrect', 'neutral');
        if (selected) {
            const answer = selected.value;
            const correctAnswer = atob(quiz.correct);
            if (answer === correctAnswer) {
                feedbackDiv.textContent = 'Correct! Great job!';
                feedbackDiv.classList.add('correct');
                quizScore += 1;
            } else {
                feedbackDiv.textContent = `Incorrect. The correct answer is "${correctAnswer}".`;
                feedbackDiv.classList.add('incorrect');
            }
            document.querySelectorAll(`input[name="quiz-${index}"]`).forEach(input => input.disabled = true);

            const nextBtn = document.createElement('button');
            nextBtn.id = 'submit-quiz';
            nextBtn.className = 'btn-submit';
            nextBtn.textContent = index === totalQuestions - 1 ? 'Done' : 'Next';
            nextBtn.setAttribute('aria-label', index === totalQuestions - 1 ? 'Complete Quiz' : 'Next Question');
            nextBtn.onclick = () => {
                if (currentQuiz < totalQuestions - 1) {
                    currentQuiz++;
                    renderQuizQuestion(currentQuiz);
                    setTimeout(() => document.getElementById(`option-${currentQuiz}-0`)?.focus(), 100);
                } else {
                    feedbackDiv.classList.remove('correct', 'incorrect');
                    endQuiz();
                }
            };
            quizContent.replaceChild(nextBtn, submitBtn);
        } else {
            feedbackDiv.textContent = 'Please select an answer!';
            feedbackDiv.classList.add('incorrect');
        }
    };

    if (!index) document.getElementById(`option-${index}-0`)?.focus();
}

// End quiz and set SCORM data
function endQuiz() {
    const feedbackDiv = document.getElementById('quiz-feedback');
    feedbackDiv.textContent = 'Quiz complete! Welcome aboard!';
    feedbackDiv.classList.add('neutral');

    if (isScormActive) {
        const score = Math.round((quizScore / totalQuestions) * 100);
        console.log(`Setting score: ${score}`);
        scorm.set("cmi.core.score.raw", score.toString());
        scorm.set("cmi.core.score.min", "0");
        scorm.set("cmi.core.score.max", "100");
        scorm.set("cmi.core.lesson_status", "completed");
        scorm.save();
        console.log("Quiz completed, SCORM data saved");
        endSession();
    }
}

// End SCORM session
function endSession() {
    if (isScormActive) {
        const endTime = new Date();
        const sessionTime = Math.round((endTime - startTime) / 1000);
        const formattedTime = formatSessionTime(sessionTime);
        console.log(`Setting session time: ${formattedTime}`);
        scorm.set("cmi.core.session_time", formattedTime);

        if (scorm.get("cmi.core.lesson_status") !== "completed") {
            scorm.set("cmi.core.lesson_status", "incomplete");
        }
        scorm.save();
        scorm.quit();
        console.log("SCORM session ended");
        isScormActive = false;
    }
}

// Format session time as HHH:MM:SS
function formatSessionTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to darken a hex color
function darkenColor(hex, amount) {
    let usePound = false;
    if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) * (1 - amount);
    let g = ((num >> 8) & 0x00FF) * (1 - amount);
    let b = (num & 0x0000FF) * (1 - amount);
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    const newColor = (r << 16) | (g << 8) | b;
    return (usePound ? "#" : "") + newColor.toString(16).padStart(6, '0');
}