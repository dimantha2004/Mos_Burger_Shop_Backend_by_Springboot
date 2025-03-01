document.getElementById('signin-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;

    const userDTO = {
        username: username,
        email: email,
        password: password
    };

    fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDTO)
    })
    .then(response => {
        if (response.ok) {
            return response.text(); 
        } else {
            throw new Error('Signin failed');
        }
    })
    .then(message => {
        alert(message);   
        
        document.querySelector('.signin-container').style.display = 'none';
        document.querySelector('.login-container').style.display = 'block';
    })
    .catch(error => {
        alert('Signin failed. Please try again.');
        console.error(error);
    });
});