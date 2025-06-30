// for approval of form
function setApproval(studentId) {
    fetch('/updateApprovaloflib', {
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
    // rejection
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

  // Finally, attach the Reject button handler here:
  document.getElementById("modal_reject_button" + srNo).onclick = function() {
    const lib_remarks = document.getElementById("remarks_select_field" + srNo).value;
    const lib_rejection_reason = document.getElementById("custom_rejection_reason_input" + srNo).value;

    if (!currentStudentId) {
      alert("No student selected!");
      return;
    }

    fetch('/updateRejectionOflib', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id: currentStudentId,
        lib_remarks: lib_remarks,
        lib_rejection_reason: lib_rejection_reason
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data.message);
      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
}








// for viewing the user info
function openModal(courseName, userId, branch, GR_no, srNo, libStatus) {
    // Fill in text fields
    document.getElementById("modalName").innerText = courseName;
    document.getElementById("modalEmail").innerText = userId;
    document.getElementById("modalBranch").innerText = branch;
    document.getElementById("modalGRNo").innerText = GR_no;

    const approveBtn = document.getElementById("modalApproveBtn");
    const rejectBtn = document.getElementById("modalRejectBtn");

    if (libStatus === "1") {
        approveBtn.innerText = "Approved";
        approveBtn.disabled = true;
        rejectBtn.innerText = "Reject";
        rejectBtn.disabled = false;
    } else if (libStatus === "2") {
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


// now i want it to work in such a way that as soon as i click on approve it should get approved ... at the same time it should get hidden from the hod landing page and get displayed in the accepted forms section ........... or ele what we can do is display all the forms accepted and rejected both... after getting accepted or rejected on landing page it should get colored red for reject and green for accept and white means no operation performed ... also they should also be visible in theri respective pages as well... i.e > in accepted and rejected section 
// or
// once approved remove approve button from general info page of each User(hod,lib,acc)