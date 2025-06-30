// for viewing the user info 
function openModal(courseName, userId, branch, GR_no, srNo) {
    // Populate modal content with the student's data
    document.getElementById("modalName").innerText = courseName;
    document.getElementById("modalEmail").innerText = userId;
            document.getElementById("modalBranch").innerText = branch;  
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