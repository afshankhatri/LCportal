// for approval of form
function setApproval(studentId) {
    fetch('/updateApprovalofacc', {
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

// for rejection of form
// Store current student being rejected
function openRejectModal(srNo) {
    currentStudentId = srNo;
    const modalOverlay = document.getElementById("modal_overlay" + srNo);
    modalOverlay.style.display = "flex"; // Changed from "block" to "flex"

    // Set close button click dynamically
    document.getElementById("close_modal_icon" + srNo).onclick = () => {
        modalOverlay.style.display = "none";
    };

    // Also set window click dynamically
    window.onclick = function (event) {
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
        }
    };

    // Finally, attach the Reject button handler here:
    document.getElementById("modal_reject_button" + srNo).onclick = function() {
    const acc_remarks = document.getElementById("remarks_select_field" + srNo).value;
    const acc_rejection_reason = document.getElementById("custom_rejection_reason_input" + srNo).value;
    const studentEmail = document.querySelector("#modal_reject_button" + srNo).getAttribute("data-email");

    if (!currentStudentId) {
        alert("No student selected!");
        return;
    }

    // Step 1: Update rejection in DB
    fetch('/updateRejectionOfacc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student_id: currentStudentId,
            acc_remarks: acc_remarks,
            acc_rejection_reason: acc_rejection_reason
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rejection updated:', data.message);

        // Step 2: Send rejection email
        return fetch('/accRejected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({ email: studentEmail })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email sent:', data.message);
        alert("Rejection processed and email sent.");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error during rejection or email:', error);
        alert('Something went wrong while processing the rejection.');
    });
  };
}








// for viewing the user info
function openModal(courseName, userId, branch, GR_no, srNo, accStatus) {
    // Fill in text fields
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

    const approveBtn = document.getElementById("modalApproveBtn");
    const rejectBtn = document.getElementById("modalRejectBtn");

    if (accStatus === "1") {
        approveBtn.innerText = "Approved";
        approveBtn.disabled = true;
        rejectBtn.innerText = "Reject";
        rejectBtn.disabled = false;
    } else if (accStatus === "2") {
        approveBtn.innerText = "Approve";
        approveBtn.disabled = false;
        rejectBtn.innerText = "Rejected";
        rejectBtn.disabled = true;
    } else {
        approveBtn.innerText = "Approve";
        approveBtn.disabled = false;
        rejectBtn.innerText = "Reject";
        rejectBtn.disabled = false;
    }

    // Update Approve button click handler
    approveBtn.onclick = function () {
        this.disabled = true;
        setApproval(srNo);
    };

    // Update Reject button click handler
    rejectBtn.onclick = function () {
        openRejectModal(srNo);
    };

    document.getElementById("userModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("userModal").style.display = "none";
}

// Optional: Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById("userModal");
    if (event.target == modal) {
        closeModal();
    }
}


function getCSRFToken() {
    const cookie = document.cookie.match('(^|;)\\s*csrf_token\\s*=\\s*([^;]+)');
    return cookie ? cookie.pop() : '';
}