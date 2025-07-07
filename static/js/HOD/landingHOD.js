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

// for rejection of form
        // function setRejection(studentId) {
        //     const hod_rejection_reason = document.getElementById("custom_rejection_reason_input").value;
        //     const hod_remarks = document.getElementById("remarks_select_field").value;
        //     console.log(hod_rejection_reason,hod_remarks)
        //     fetch('/updateRejectionOfHOD', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'  // Important!
        //         },
        //         body: JSON.stringify({ 
        //             student_id: studentId,
        //             hod_remarks:hod_remarks,
        //             hod_rejection_reason:hod_rejection_reason
        //         })  // sending student ID to backend
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data.message);
        //         // You can also update UI here if needed
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
        // }

        // // open closing model of rejection
        // const rejectModalTriggerBtn = document.getElementById('trigger_reject_modal_button');
        // const modalOverlay = document.getElementById('modal_overlay');
        // const closeModalBtn = document.getElementById('close_modal_icon');

        // // Open modal
        // rejectModalTriggerBtn.onclick = () => {
        // modalOverlay.style.display = 'block';
        // };

        // // Close modal on close icon click
        // closeModalBtn.onclick = () => {
        // modalOverlay.style.display = 'none';
        // };

        // // Close modal on outside click
        // window.onclick = function(event) {
        // if (event.target === modalOverlay) {
        //     modalOverlay.style.display = 'none';
        //     }
        // };



    // 2nd type of rejection
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
    const hod_remarks = document.getElementById("remarks_select_field" + srNo).value;
    const hod_rejection_reason = document.getElementById("custom_rejection_reason_input" + srNo).value;

    if (!currentStudentId) {
      alert("No student selected!");
      return;
    }

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
      console.log('Success:', data.message);
      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
}







// for viewing the user info
// function openModal(courseName, userId, branch, GR_no, srNo) {
//     // Populate modal content with the student's data
//     document.getElementById("modalName").innerText = courseName;
//     document.getElementById("modalEmail").innerText = userId;
//     document.getElementById("modalBranch").innerText = branch;  
//     document.getElementById("modalGRNo").innerText = GR_no; 
    
//     //Update the Approve button with the correct student ID
//     const approveBtn = document.getElementById("modalApproveBtn" );
//     approveBtn.setAttribute("onclick", `setApproval('${srNo}')`);
    
//     // Show the modal
//     document.getElementById("userModal").style.display = "flex";
// }

// bugg solving of view-details
function openModal(courseName, userId, branch, GR_no, srNo, hodStatus) {
    // Fill in text fields
    document.getElementById("modalName").innerText = courseName;
    document.getElementById("modalEmail").innerText = userId;

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