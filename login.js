// Redirect to the signin form when the "Signin" button is clicked
document.getElementById('signin-btn').addEventListener('click', function () {
    // Hide login container and show signin container
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.signin-container').style.display = 'block';
});

// Login function
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('USERNAME').value;
    const password = document.getElementById('PASSWORD').value;

    // Retrieve saved user data from localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedUser && username === savedUser.username && password === savedUser.password) {
        alert('Login successful!');
        
        // Hide the login container and show the app content
        document.querySelector('.login-container').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
    } else {
        alert('Incorrect username or password. Please try again.');
    }
});