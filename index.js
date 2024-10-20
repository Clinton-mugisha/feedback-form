const services = [
    'Reception',
    'Cash Office',
    'Triage',
    'Doctor Consultation',
    'Immunization Services',
    'Imaging Services',
    'Pharmacy',
    'Nursing Care',
    'Cafeteria',
    'Admission/Discharge Process'
];

let currentStep = 1;
const totalSteps = services.length + 2; // Add 2 for initial and final steps
const feedback = {
    ratings: {},
    comments: {}
};

// Initialize service feedback steps
const serviceContainer = document.getElementById('service-feedback-container');
services.forEach((service, index) => {
    const stepHtml = `
        <div id="step-${index + 2}" class="step p-6">
            <div class="feedback-card">
                <h3 class="service-title">${service}</h3>
                <div class="stars" data-service="${service}">
                    ${[5,4,3,2,1].map(num => `
                        <span class="star" data-rating="${num}">★</span>
                    `).join('')}
                </div>
                <div class="input-group feedback-comment" style="display: none;">
                    <label>What could we improve?</label>
                    <textarea class="input" rows="3" placeholder="Please share your experience..."></textarea>
                </div>
            </div>
        </div>
    `;
    serviceContainer.insertAdjacentHTML('beforeend', stepHtml);
});

// Initialize recommendation scale
const scaleContainer = document.getElementById('recommendation-scale');
for (let i = 0; i <= 10; i++) {
    const scaleNumber = document.createElement('div');
    scaleNumber.className = 'scale-number';
    scaleNumber.textContent = i;
    scaleNumber.onclick = () => selectRecommendation(i);
    scaleContainer.appendChild(scaleNumber);
}

// Setup event listeners
document.getElementById('patient-type').addEventListener('change', function() {
    const roomNumberGroup = document.getElementById('room-number-group');
    roomNumberGroup.style.display = this.value === 'inpatient' ? 'block' : 'none';
});

document.querySelectorAll('.stars').forEach(starsContainer => {
    starsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            const service = this.dataset.service;
            const stars = this.querySelectorAll('.star');
            
            stars.forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                star.classList.toggle('active', starRating <= rating);
            });

            feedback.ratings[service] = rating;
            const commentSection = this.parentElement.querySelector('.feedback-comment');
            commentSection.style.display = rating <= 3 ? 'block' : 'none';
        }
    });
});

function selectRecommendation(value) {
    document.querySelectorAll('.scale-number').forEach(num => {
        num.classList.toggle('active', parseInt(num.textContent) === value);
    });
    feedback.recommendation = value;
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const percentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progress.style.width = `${percentage}%`;
}

function showStep(step) {
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.toggle('active', index + 1 === step);
    });
    
    document.getElementById('prevBtn').style.display = step === 1 ? 'none' : 'block';
    document.getElementById('nextBtn').textContent = step === totalSteps ? 'Submit' : 'Next';
    
    updateProgress();
}

function navigate(direction) {
    if (direction === 1 && !validateCurrentStep()) return;

    currentStep += direction;
    
    if (currentStep > totalSteps) {
        submitFeedback();
        return;
    }
    
    if (currentStep < 1) currentStep = 1;
    showStep(currentStep);
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const name = document.getElementById('name').value;
        const type = document.getElementById('patient-type').value;
        if (!name || !type) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    }
    return true;
}

function submitFeedback() {
    // Collect all feedback data
    feedback.name = document.getElementById('name').value;
    feedback.patientType = document.getElementById('patient-type').value;
    feedback.email = document.getElementById('email').value;
    feedback.phone = document.getElementById('phone').value;
    feedback.comments = document.getElementById('comments').value;
    document.querySelectorAll('.step, .nav-buttons').forEach(el => el.style.display = 'none');
    document.getElementById('success-message').style.display = 'block';
    
    console.log('Feedback submitted:', feedback);
}

// Initialize
showStep(1);