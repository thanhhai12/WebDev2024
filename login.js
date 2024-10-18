document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = {
        'user': {
            email: 'user@paidaccount.com',
            password: 'user1',
            role: 'user'
        },
        'guest': {
            email: 'guest@freeaccount.com',
            password: 'guest1',
            role: 'guest'
        }
    };

    let currentUser = null;

    if (email === users['user'].email && password === users['user'].password) {
        alert('user login successful');
        currentUser = users['user'];
    } else if (email === users['guest'].email && password === users['guest'].password) {
        alert('guest user login successful');
        currentUser = users['guest'];
    } else {
        alert('Invalid email or password');
        return; 
    }

    localStorage.setItem('userRole', currentUser.role);
    if (currentUser.role === 'user') {
        window.location.href = 'index.html';
    } else if (currentUser.role === 'guest') {
        window.location.href = 'index.html'; 
    }
});

function getCurrentUserRole() {
    return localStorage.getItem('userRole'); 
}

function checkAccess(page) {
    const userRole = getCurrentUserRole(); 

    if (userRole === 'user') {

        return true;
    } else if (userRole === 'guest' && page === 'index.html') {
        return true;
    } else {
        alert('Access Denied');
        window.location.href = 'index.html'; 
        return false;
    }
}
