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
        function setRejection(studentId) {
            fetch('/updateRejectionOfHOD', {
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
        // }
        // };







// for viewing the user info
function openModal(courseName, userId, branch, GR_no, srNo) {
    // Populate modal content with the student's data
    document.getElementById("modalName").innerText = courseName;
    document.getElementById("modalEmail").innerText = userId;
            document.getElementById("modalBranch").innerText = branch;  
    document.getElementById("modalGRNo").innerText = GR_no; 
    
    //Update the Approve button with the correct student ID
    const approveBtn = document.getElementById("modalApproveBtn");
    approveBtn.setAttribute("onclick", `setApproval('${srNo}')`);
    
    // Show the modal
    document.getElementById("userModal").style.display = "flex";
}
    
function closeModal() {
    document.getElementById("userModal").style.display = "none";
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