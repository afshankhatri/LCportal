function openModal(courseName, userId, branch, GR_no, srNo) {
    document.getElementById("modalName").innerText = courseName;
    document.getElementById("modalEmail").innerText = userId;

    const branchNames = ["Artificial Intelligence & Machine Learning", "IOT", "Computer Science", "IT", "EXTC", "Mech", "Civil"];
    document.getElementById("modalBranch").innerText = branchNames[branch] || "Unknown Branch";

    document.getElementById("modalGRNo").innerText = GR_no;

    const userModal = document.getElementById("userModal");
    userModal.style.display = "flex";
}

function closeModal() {
    document.getElementById("userModal").style.display = "none";
}

// Close modal on background click
document.addEventListener("click", function (event) {
    const modal = document.getElementById("userModal");
    if (event.target === modal) {
        closeModal();
    }
});
