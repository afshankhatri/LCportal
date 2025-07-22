// for approval of registration form
function setApproval(studentId) {
    fetch('/updateApprovalofVerifierClerk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Important!
        },
        body: JSON.stringify({ student_id: studentId })  // sending student ID to backend
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data.message);
        // You can also update UI here if needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}   

// for rejection of registration form
function setRejection(studentId) {
    fetch('/updateRejectionofVerifierClerk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Important!
        },
        body: JSON.stringify({ student_id: studentId })  // sending student ID to backend
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data.message);
        // You can also update UI here if needed
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// for accepting the registration form of student
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.call-button-accept').forEach(button => {
        button.addEventListener('click', () => {
            const studentEmail = button.getAttribute('data-email');

            // button.disabled = true;

            fetch('/RegistrationAcceptance', {
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

// for rejecting the registration form of student

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.call-button-reject').forEach(button => {
        button.addEventListener('click', () => {
            const studentEmail = button.getAttribute('data-email');

            // button.disabled = true;

            fetch('/RegistrationRejection', {
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