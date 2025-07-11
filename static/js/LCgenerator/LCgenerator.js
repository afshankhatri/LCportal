// for viewing the user info 
function openModal(courseName, userId, branch, GR_no, srNo,LCgenerated) {
    // Populate modal content with the student's data
    document.getElementById("modalName").innerText = courseName;
    document.getElementById("modalEmail").innerText = userId;
    if (branch == 0) {
        document.getElementById("modalBranch").innerText = "Artificial Intelligence & Machine Learning";
    } else if (branch == 1) {
        document.getElementById("modalBranch").innerText = "IOT";
    } else if (branch == 2) {
        document.getElementById("modalBranch").innerText = "Computer Science";
    } else if (branch == 3) {
        document.getElementById("modalBranch").innerText = "IT";
    } else if (branch == 4) {
        document.getElementById("modalBranch").innerText = "EXTC";
    } else if (branch == 5) {
        document.getElementById("modalBranch").innerText = "Mech";
    } else if (branch == 6) {
        document.getElementById("modalBranch").innerText = "Civil";
    } else {
        document.getElementById("modalBranch").innerText = "Unknown Branch";
    } 
    document.getElementById("modalGRNo").innerText = GR_no; 
    
    
    // Show the modal
    document.getElementById("userModal").style.display = "flex";
    console.log("opened")
}
    
function closeModal() {
    document.getElementById("userModal").style.display = "none";
    console.log("closed")

}
    
// Optional: Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById("userModal");
    if (event.target == modal) {
        closeModal();
    }
}


// below code is for sending email 

        // Event delegation for call buttons
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.call-button').forEach(button => {
                button.addEventListener('click', () => {
                    const studentEmail = button.getAttribute('data-email');

                    button.disabled = true;

                    fetch('/send_email', {
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