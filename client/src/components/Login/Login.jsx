import React, { useCallback, useState } from 'react';
import styles from './style.module.css';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';

function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clientError, setClientError] = useState('');
  const [login, { error }] = useMutation(LOGIN_MUTATION);

  const handleChangeToSignup = useCallback(() => {
    setValues({ email: '', password: '' });
    navigate('/signup');
  }, [navigate]);

  const handleChangeValues = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues({ ...values, [name]: value });
    },
    [values],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (Object.values(values).some((value) => value.length === 0)) {
        setClientError('All inputs are required');
        return;
      }

      try {
        const { data } = await login({ variables: values });
        const user = {
          id: data.login.user.id,
          email: data.login.user.email,
          token: data.login.token,
        };
        dispatch(setUser(user));
        navigate('/dashboard');
      } catch (e) {
        console.log(e);
      }
    },
    [dispatch, login, navigate, values],
  );

  return (
    <div className={styles.container}>
      <form className={styles.wrapper} onSubmit={handleSubmit}>
        <div>
          <h1>Login</h1>
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
            Login
          </button>
        </div>

        <div>
          <span className={styles.error_message}>{error?.message || clientError || ''}</span>
        </div>

        <div className={styles.switch_login_wrapper}>
          <span className={styles.switch_login_text}>Dont have an account?</span>
          <button type="button" onClick={handleChangeToSignup} className={styles.switch_btn}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
