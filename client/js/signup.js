async function signup(userData) {
    try {
        const response = await fetch('http:https://research-x-i19v.vercel.app/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Signup successful! Please log in.');
            window.location.href = '/login.html';
        } else {
            alert('Signup failed: ' + data.error);
        }
    } catch (err) {
        console.error('Signup error:', err);
        alert('An error occurred during signup.');
    }
}
