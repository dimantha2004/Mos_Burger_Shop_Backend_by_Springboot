// Signin function
document.getElementById('signin-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    // Save user data to localStorage
    const user = {
        username: username,
        email: email,
        password: password
    };
    localStorage.setItem('user', JSON.stringify(user));

    alert('Signin successful! Please log in.');

    // Redirect back to the login form
    document.querySelector('.signin-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
});