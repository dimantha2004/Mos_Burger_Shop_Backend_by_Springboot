// Toggle between Login and Signup forms
document.getElementById('show-signup').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.signup-container').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.signup-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
});

// Login Form Submission
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('USERNAME').value;
    const password = document.getElementById('PASSWORD').value;

    fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(message => {
        alert(message);
        document.querySelector('.login-container').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
    })
    .catch(error => {
        alert('Incorrect username or password. Please try again.');
        console.error(error);
    });
});

// document.getElementById('login-form').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const username = document.getElementById('USERNAME').value;
//     const password = document.getElementById('PASSWORD').value;

//     fetch('http://localhost:8080/api/users/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.text(); 
//         } else {
//             throw new Error('Login failed');
//         }
//     })
//     .then(message => {
//         alert(message); 
        
//         document.querySelector('.login-container').style.display = 'none';
//         document.getElementById('app-content').style.display = 'block';
//     })
//     .catch(error => {
//         alert('Incorrect username or password. Please try again.');
//         console.error(error);
//     });
// });