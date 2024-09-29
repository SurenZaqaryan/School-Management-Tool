import React, { useState } from 'react';
import styles from './style.module.css';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from '../../graphql/mutations';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [clientError, setClientError] = useState('');
  const [signup, { error }] = useMutation(SIGNUP_MUTATION);

  const handleChangeToLogin = () => {
    setValues({ email: '', password: '' });
    navigate('/');
  };

  const handleChangeValues = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (Object.values(values).some((value) => value.length === 0)) {
      setClientError('All inputs are required');
      return;
    }

    try {
      const { data } = await signup({ variables: values });
      data?.signup?.message === 'success' && handleChangeToLogin();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.wrapper} onSubmit={handleSignUp}>
        <div>
          <h1>Sign up</h1>
        </div>
        <div className={styles.input_wrapper}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.input}
            name="email"
            id="email"
            type="email"
            value={values.email}
            onChange={handleChangeValues}
          />
        </div>
        <div className={styles.input_wrapper}>
          <label className={styles.label} htmlFor="password">
            Password
          </label>
          <input
            className={styles.input}
            name="password"
            id="password"
            type="password"
            value={values.password}
            onChange={handleChangeValues}
          />
        </div>
        <div>
          <button type="submit" className={styles.submit_btn}>
            Sign up
          </button>
        </div>

        <div>
          <span className={styles.error_message}>{error?.message || clientError || ''}</span>
        </div>

        <div className={styles.switch_login_wrapper}>
          <span className={styles.switch_login_text}>Already have an account?</span>
          <button type="button" onClick={handleChangeToLogin} className={styles.switch_btn}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
