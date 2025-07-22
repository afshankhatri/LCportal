function setApproval(studentId) {
    fetch('/forceApprove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ student_id: studentId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data.message);
        location.reload();  // Optional: reload to reflect change
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}