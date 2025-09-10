// ADHD Resources Web Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeASRSTest();
});

// Navigation functionality
function initializeNavigation() {
    const homeButtons = document.querySelectorAll('#home-btn, #home-main-btn');
    const asrsButtons = document.querySelectorAll('#asrs-test-btn, #asrs-main-btn');

    homeButtons.forEach(button => {
        button.addEventListener('click', function() {
            scrollToSection('hero');
        });
    });

    asrsButtons.forEach(button => {
        button.addEventListener('click', function() {
            scrollToSection('asrs-test');
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ASRS Test functionality
function initializeASRSTest() {
    const startButton = document.getElementById('start-asrs');
    if (startButton) {
        startButton.addEventListener('click', startASRSTest);
    }
}

const asrsQuestions = [
    {
        text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
        id: "q1"
    },
    {
        text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
        id: "q2"
    },
    {
        text: "How often do you have problems remembering appointments or obligations?",
        id: "q3"
    },
    {
        text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
        id: "q4"
    },
    {
        text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
        id: "q5"
    },
    {
        text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
        id: "q6"
    }
];

const responseOptions = [
    { value: 0, text: "Never" },
    { value: 1, text: "Rarely" },
    { value: 2, text: "Sometimes" },
    { value: 3, text: "Often" },
    { value: 4, text: "Very Often" }
];

function startASRSTest() {
    const questionsContainer = document.getElementById('asrs-questions');
    const startButton = document.getElementById('start-asrs');
    
    if (!questionsContainer || !startButton) return;

    // Hide start button and show questions
    startButton.style.display = 'none';
    
    // Generate questions HTML
    let questionsHTML = '<form id="asrs-form">';
    
    asrsQuestions.forEach((question, index) => {
        questionsHTML += `
            <div class="question">
                <h4>${index + 1}. ${question.text}</h4>
                <div class="question-options">
        `;
        
        responseOptions.forEach(option => {
            questionsHTML += `
                <label>
                    <input type="radio" name="${question.id}" value="${option.value}" required>
                    <span>${option.text}</span>
                </label>
            `;
        });
        
        questionsHTML += `
                </div>
            </div>
        `;
    });
    
    questionsHTML += `
        <button type="submit" class="btn primary" style="margin-top: 2rem;">Calculate Results</button>
        </form>
    `;
    
    questionsContainer.innerHTML = questionsHTML;
    
    // Add form submission handler
    const form = document.getElementById('asrs-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateASRSResults();
    });
}

function calculateASRSResults() {
    const form = document.getElementById('asrs-form');
    const resultContainer = document.getElementById('asrs-result');
    
    if (!form || !resultContainer) return;
    
    const formData = new FormData(form);
    let totalScore = 0;
    let answeredQuestions = 0;
    
    asrsQuestions.forEach(question => {
        const answer = formData.get(question.id);
        if (answer !== null) {
            totalScore += parseInt(answer);
            answeredQuestions++;
        }
    });
    
    if (answeredQuestions < asrsQuestions.length) {
        alert('Please answer all questions before calculating results.');
        return;
    }
    
    // Calculate percentage and provide interpretation
    const maxScore = asrsQuestions.length * 4; // Max score possible
    const percentage = (totalScore / maxScore) * 100;
    
    let interpretation = '';
    let recommendationClass = '';
    
    if (percentage < 25) {
        interpretation = 'Low likelihood of ADHD symptoms';
        recommendationClass = 'low-risk';
    } else if (percentage < 50) {
        interpretation = 'Some ADHD symptoms present - consider discussing with a healthcare provider';
        recommendationClass = 'moderate-risk';
    } else if (percentage < 75) {
        interpretation = 'Moderate ADHD symptoms - recommend consultation with a healthcare professional';
        recommendationClass = 'high-risk';
    } else {
        interpretation = 'High ADHD symptoms - strongly recommend professional evaluation';
        recommendationClass = 'very-high-risk';
    }
    
    resultContainer.innerHTML = `
        <h3>Your ASRS Results</h3>
        <div class="score-display ${recommendationClass}">
            <p><strong>Score: ${totalScore}/${maxScore} (${percentage.toFixed(1)}%)</strong></p>
            <p><strong>Interpretation:</strong> ${interpretation}</p>
        </div>
        <div class="disclaimer">
            <p><strong>Important:</strong> This screening tool is not a diagnostic test. It's designed to help identify symptoms that may warrant further evaluation by a qualified healthcare professional. If you're concerned about ADHD symptoms, please consult with a doctor or mental health professional.</p>
        </div>
        <div class="next-steps">
            <h4>Recommended Next Steps:</h4>
            <ul>
                <li>Share these results with your healthcare provider</li>
                <li>Consider keeping a symptom diary</li>
                <li>Explore the expert resources on this page</li>
                <li>Learn about ADHD management strategies</li>
            </ul>
        </div>
        <button class="btn secondary" onclick="resetASRSTest()">Take Test Again</button>
    `;
    
    // Add CSS classes for result styling
    addResultStyles();
    
    // Show results
    resultContainer.style.display = 'block';
    
    // Hide the form
    form.style.display = 'none';
}

function resetASRSTest() {
    const questionsContainer = document.getElementById('asrs-questions');
    const resultContainer = document.getElementById('asrs-result');
    const startButton = document.getElementById('start-asrs');
    
    if (questionsContainer) {
        questionsContainer.innerHTML = '';
    }
    
    if (resultContainer) {
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
    }
    
    if (startButton) {
        startButton.style.display = 'inline-block';
    }
}

function addResultStyles() {
    // Add dynamic styles for results if not already present
    if (!document.getElementById('result-styles')) {
        const style = document.createElement('style');
        style.id = 'result-styles';
        style.textContent = `
            .score-display {
                padding: 1.5rem;
                border-radius: 8px;
                margin: 1rem 0;
                text-align: center;
            }
            .low-risk {
                background-color: #d4edda;
                border-left: 4px solid #27ae60;
                color: #155724;
            }
            .moderate-risk {
                background-color: #fff3cd;
                border-left: 4px solid #f39c12;
                color: #856404;
            }
            .high-risk {
                background-color: #f8d7da;
                border-left: 4px solid #e74c3c;
                color: #721c24;
            }
            .very-high-risk {
                background-color: #f5c6cb;
                border-left: 4px solid #dc3545;
                color: #491217;
            }
            .disclaimer {
                background-color: #e7f3ff;
                padding: 1rem;
                border-radius: 6px;
                margin: 1rem 0;
                border-left: 4px solid #3498db;
            }
            .next-steps {
                background-color: #f8f9fa;
                padding: 1rem;
                border-radius: 6px;
                margin: 1rem 0;
                text-align: left;
            }
            .next-steps ul {
                margin-left: 1rem;
                margin-top: 0.5rem;
            }
            .next-steps li {
                margin: 0.5rem 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add accessibility features
document.addEventListener('keydown', function(e) {
    // Allow Enter key to trigger button clicks for accessibility
    if (e.key === 'Enter' && e.target.matches('button:not([type="submit"])')) {
        e.target.click();
    }
});