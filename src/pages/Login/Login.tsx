import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
  
import './style.css'

interface LoginPageProps {
  onLogin: (input: { email: string, password: string }) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const navigate = useNavigate();
  
  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    return onLogin && onLogin({ email, password })
      .then(() => {
        setLoggedIn(true);
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        toast.error(error.message);
      })
    
  }
  return (
    <>
      <h1 className='login-title'>Acessar Sistema</h1>
      <form className='login-form' onSubmit={handleLogin}>
        <div className="form-item">
          <label className='my-label' aria-required htmlFor="email">Email:</label>
          <input className='my-input' autoFocus onInput={(event) => setEmail(event.currentTarget.value)} required type="email" name="email" id="email" />
        </div>
        <div className="form-item">
          <label className='my-label' aria-required htmlFor="password">Senha:</label>
          <input className='my-input' onInput={(event) => setPassword(event.currentTarget.value)} required type="password" name="password" id="password" />
        </div>
        <div className="form-button">
          <button className='my-btn' type="submit">Entrar</button>
        </div>
      </form>
    </>
  );
}
