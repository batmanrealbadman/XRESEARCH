<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - ResearchX</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        :root {
            --primary: #0d6efd;
            --secondary: #198754;
            --accent: #fd7e14;
            --dark: #212529;
            --light: #f8f9fa;
        }

        body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .login-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
            padding: 40px;
            margin: 20px;
        }

        .logo {
            text-align: center;
            margin-bottom: 30px;
        }

        .logo i {
            font-size: 2.5rem;
            color: var(--accent);
        }

        .logo h1 {
            color: var(--primary);
            margin-top: 10px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--dark);
        }

        .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border 0.3s ease;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .btn {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            font-size: 1rem;
            position: relative;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }

        .form-footer {
            margin-top: 20px;
            text-align: center;
        }

        .form-footer a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
        }

        .form-footer a:hover {
            text-decoration: underline;
        }

        .error-message {
            color: #dc3545;
            margin-top: 5px;
            font-size: 0.9rem;
            display: none;
        }

        .btn-spinner {
            display: none;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .btn-text {
            transition: opacity 0.3s;
        }

        .btn-loading .btn-text {
            opacity: 0;
        }

        .btn-loading .btn-spinner {
            display: inline-block;
        }

        @media (max-width: 576px) {
            .login-container {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <h1>ResearchX</h1>
        </div>

        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
                <div class="error-message" id="emailError"></div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
                <div class="error-message" id="passwordError"></div>
            </div>

            <div class="form-group" style="text-align: right;">
                <a href="forgot-password.html" style="font-size: 0.9rem;">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary" id="loginBtn">
                <span class="btn-text">Login</span>
                <span class="btn-spinner"><i class="fas fa-spinner fa-spin"></i></span>
            </button>

            <div class="form-footer">
                <p>Don't have an account? <a href="signup.html">Sign Up</a></p>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginBtn = document.getElementById('loginBtn');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');

            // Reset errors
            emailError.style.display = 'none';
            passwordError.style.display = 'none';

            // Validate inputs
            if (!email) {
                emailError.textContent = 'Email is required';
                emailError.style.display = 'block';
                return;
            }

            if (!password) {
                passwordError.textContent = 'Password is required';
                passwordError.style.display = 'block';
                return;
            }

            // Show loading state
            loginBtn.classList.add('btn-loading');
            loginBtn.disabled = true;

            try {
                const response = await fetch('https://researchxng.vercel.app/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identifier: email,
                        password: password
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Login failed');
                }

                const { session } = await response.json();
                
                // Store session and redirect
                localStorage.setItem('supabase_session', JSON.stringify(session));
                window.location.href = 'dashboard.html';

            } catch (error) {
                console.error('Login error:', error);
                passwordError.textContent = error.message.includes('Failed to fetch')
                    ? 'Server unavailable. Please try again later.'
                    : error.message;
                passwordError.style.display = 'block';
            } finally {
                loginBtn.classList.remove('btn-loading');
                loginBtn.disabled = false;
            }
        });

        // Auto-focus email field on page load
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('email').focus();
        });
    </script>
</body>
</html>