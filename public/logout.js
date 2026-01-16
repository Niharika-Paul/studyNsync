function logout() {
    // Call the server's logout endpoint
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Logout successful:', data);
        // Redirect to landing page after successful logout
        window.location.href = '/landing.html';
    })
    .catch(error => {
        console.error('Logout error:', error);
        // Still redirect to landing page even if there's an error
        window.location.href = '/landing.html';
    });
}
