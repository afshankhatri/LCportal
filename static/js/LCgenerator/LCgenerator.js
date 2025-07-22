// Tab switching functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize tab functionality
    initializeTabs();

    // Initialize modal functionality
    initializeModal();

    // Initialize call button functionality
    initializeCallButtons();

    // Show pending cards by default
    showCards('pending');
});

// Tab functionality
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show cards based on tab
            const tabType = this.dataset.tab;
            showCards(tabType);
        });
    });
}

// Show cards based on filter
function showCards(filterType) {
    const cards = document.querySelectorAll('.student-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCards = 0;

    cards.forEach(card => {
        const cardStatus = card.dataset.status;

        if (filterType === 'pending' && cardStatus === 'pending') {
            card.style.display = 'block';
            visibleCards++;
        } else if (filterType === 'generated' && cardStatus === 'generated') {
            card.style.display = 'block';
            visibleCards++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show empty state if no cards are visible
    if (visibleCards === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Modal functionality
function initializeModal() {
    // Close modal when clicking outside
    document.getElementById('userModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && document.getElementById('userModal').classList.contains('show')) {
            closeModal();
        }
    });
}

// Open modal with student details
function openModal(courseName, userId, courseId, grNo, srNo, lcGenerated) {
    // Get student name from the card (you might need to pass this as a parameter)
    const studentName = 'Student Name'; // Replace with actual name parameter

    document.getElementById('modalName').textContent = studentName;
    document.getElementById('modalEmail').textContent = userId;
    document.getElementById('modalBranch').textContent = getBranchName(courseId);
    document.getElementById('modalGRNo').textContent = grNo;

    document.getElementById('userModal').classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('userModal').classList.remove('show');
}

// Get branch name from course ID
function getBranchName(courseId) {
    const branches = {
        '0': 'AIML',
        '1': 'IOT',
        '2': 'Computer Science',
        '3': 'IT',
        '4': 'EXTC',
        '5': 'Mech',
        '6': 'Civil'
    };
    return branches[courseId] || 'Unknown';
}

// Call button functionality
function initializeCallButtons() {
    document.querySelectorAll('.call-button').forEach(button => {
        button.addEventListener('click', function () {
            const email = this.dataset.email;
            const name = this.dataset.name;

            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.disabled = true;

            // Simulate API call (replace with actual API call)
            sendEmailToStudent(email, name)
                .then(response => {
                    // Success state
                    this.innerHTML = '<i class="fas fa-check"></i> Sent';
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-success', 'btn-disabled');

                    // Update card status if needed
                    const card = this.closest('.student-card');
                    const statusBadge = card.querySelector('.status-badge');
                    statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Notified';
                    statusBadge.classList.remove('status-pending');
                    statusBadge.classList.add('status-generated');

                    // Show success message
                    showNotification('Email sent successfully!', 'success');
                })
                .catch(error => {
                    // Error state
                    this.innerHTML = '<i class="fas fa-phone"></i> Call for Collection';
                    this.disabled = false;

                    // Show error message
                    showNotification('Failed to send email. Please try again.', 'error');
                    console.error('Error sending email:', error);
                });
        });
    }); 
}

// afshans code for sending email

// below code is for sending email 

// Event delegation for call buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.call-button').forEach(button => {
        button.addEventListener('click', () => {
            const studentEmail = button.getAttribute('data-email');

            button.disabled = true;

            fetch('/send_email_for_collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    email: studentEmail,
                })
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error sending email.');
                    button.disabled = false;
                });
        });
    });
});

// CSRF helper (if you have CSRF protection)
function getCSRFToken() {
    const cookie = document.cookie.match('(^|;)\\s*csrf_token\\s*=\\s*([^;]+)');
    return cookie ? cookie.pop() : '';
}

// Show notification (you can replace this with a proper notification library)
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Search functionality (if needed)
function searchStudents(query) {
    const cards = document.querySelectorAll('.student-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCards = 0;

    cards.forEach(card => {
        const name = card.querySelector('.card-title h3').textContent.toLowerCase();
        const grNo = card.querySelector('.info-value').textContent.toLowerCase();
        const branch = card.querySelectorAll('.info-value')[1].textContent.toLowerCase();

        if (name.includes(query.toLowerCase()) ||
            grNo.includes(query.toLowerCase()) ||
            branch.includes(query.toLowerCase())) {
            card.style.display = 'block';
            visibleCards++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show empty state if no cards are visible
    if (visibleCards === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Export functions for global use
window.openModal = openModal;
window.closeModal = closeModal;
window.searchStudents = searchStudents;