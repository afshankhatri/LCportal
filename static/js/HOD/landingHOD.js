// for approval of form
function setApproval(studentId) {
    fetch('/updateApprovalofHOD', {
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

    // Store current student being rejected
function openRejectModal(srNo) {
  currentStudentId = srNo;
  document.getElementById("modal_overlay" + srNo).style.display = "block";

  // Set close button click dynamically
  document.getElementById("close_modal_icon" + srNo).onclick = () => {
    document.getElementById("modal_overlay" + srNo).style.display = "none";
  };

  // Also set window click dynamically
  window.onclick = function(event) {
    if (event.target === document.getElementById("modal_overlay" + srNo)) {
      document.getElementById("modal_overlay" + srNo).style.display = "none";
    }
  };



//   {{{}}} here
  // Finally, attach the Reject button handler here:
  document.getElementById("modal_reject_button" + srNo).onclick = function() {
    const hod_remarks = document.getElementById("remarks_select_field" + srNo).value;
    const hod_rejection_reason = document.getElementById("custom_rejection_reason_input" + srNo).value;
    const studentEmail = document.querySelector("#modal_reject_button" + srNo).getAttribute("data-email");

    if (!currentStudentId) {
        alert("No student selected!");
        return;
    }

    // Step 1: Update rejection in DB
    fetch('/updateRejectionOfHOD', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            student_id: currentStudentId,
            hod_remarks: hod_remarks,
            hod_rejection_reason: hod_rejection_reason
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rejection updated:', data.message);

        // Step 2: Send rejection email
        return fetch('/hodRejected', {
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

//   {{{}}}


}


// bugg solving of view-details
function openModal(name, userId, branch, GR_no, srNo, hodStatus, libStatus, accStatus, libRemarks, libRejectionReason, accRemarks, accRejectionReason) {  // woring on creating the table for acc and lib status
    // Fill in text fields
    document.getElementById("modalName").innerText = name;
    document.getElementById("modalEmail").innerText = userId;
    console.log(name, userId, branch, GR_no, srNo, hodStatus, libStatus, accStatus, libRemarks, libRejectionReason, accRemarks, accRejectionReason);

    // document.getElementById("modalBranch").innerText = branch;
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

    if (libStatus === "1" && accStatus === "1") {
        // lib and acc both approved, handle based on hodStatus
        if (hodStatus === "1") {
            approveBtn.innerText = "Approved";
            approveBtn.disabled = true;

            rejectBtn.innerText = "Reject";
            rejectBtn.disabled = false;
        } else if (hodStatus === "2") {
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
    } else {
        // lib or acc is pending or rejected
        approveBtn.innerText = "Approve";
        approveBtn.disabled = true;

        rejectBtn.innerText = "Reject";
        rejectBtn.disabled = true;
    }

    // Librarian status logic
    const libCell = document.getElementById("libStatusCell");
    console.log(libCell)
    if (libStatus == "0") {
        libCell.innerText = "Pending";
    } else if (libStatus == "1") {
        libCell.innerText = "Approved";
    } else if (libStatus == "2") {
        libCell.innerHTML = `<strong>Remarks:</strong> ${libRemarks || "None"}<br><strong>Reason:</strong> ${libRejectionReason || "None"}`;
    } else { 
        libCell.innerText = "Unknown";
    }

    // Accountant status logic
    const accCell = document.getElementById("accStatusCell");
    if (accStatus == 0) {
        accCell.innerText = "Pending";
    } else if (accStatus == 1) {
        accCell.innerText = "Approved";
    } else if (accStatus == 2) {
        accCell.innerHTML = `<strong>Remarks:</strong> ${accRemarks || "None"}<br><strong>Reason:</strong> ${accRejectionReason || "None"}`;
    } else {
        accCell.innerText = "Unknown";
    }

    // Update Approve button click handler
    approveBtn.onclick = function() {
        this.disabled = true;
        setApproval(srNo);
    };

    // Update Reject button click handler
    rejectBtn.onclick = function() {
        openRejectModal(srNo);
    };

    document.getElementById("userModal").style.display = "flex";
}           
    
function closeModal() {
    document.getElementById("userModal" ).style.display = "none";
}
    
// Optional: Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById("userModal");
    if (event.target == modal) {
        closeModal();
    }
}



// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.call-button-hodReject').forEach(button => {
//         button.addEventListener('click', () => {
//             const studentEmail = button.getAttribute('data-email');

//             // button.disabled = true;

//             fetch('/hodRejected', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCSRFToken()
//                 },
//                 body: JSON.stringify({
//                     email: studentEmail,
//                 })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     alert(data.message);
//                     location.reload();
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                     alert('Error sending email.');
//                     button.disabled = false;
//                 });
//         });
//     });
// });

// CSRF helper (if you have CSRF protection)
function getCSRFToken() {
    const cookie = document.cookie.match('(^|;)\\s*csrf_token\\s*=\\s*([^;]+)');
    return cookie ? cookie.pop() : '';
}

// now i want it to work in such a way that as soon as i click on approve it should get approved ... at the same time it should get hidden from the hod landing page and get displayed in the accepted forms section ........... or ele what we can do is display all the forms accepted and rejected both... after getting accepted or rejected on landing page it should get colored red for reject and green for accept and white means no operation performed ... also they should also be visible in theri respective pages as well... i.e > in accepted and rejected section 
// or
// once approved remove approve button from general info page of each User(hod,lib,acc)