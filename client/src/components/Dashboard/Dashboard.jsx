import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { removeUser } from '../../redux/userSlice';
import Teachers from '../Teachers/Teachers.jsx';
import Subjects from '../Subjects/Subjects.jsx';
import Pupils from '../Pupils/Pupils.jsx';

function Dashboard() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('teachers');

  const handleLogout = () => {
    dispatch(removeUser());
  };

  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.nav_left_block}>
          <span
            className={styles.tab_text}
            onClick={() => setActiveTab('teachers')}
            style={{
              borderBottom: activeTab === 'teachers' ? '1px solid black' : 'none',
            }}>
            Teachers
          </span>
          <span
            className={styles.tab_text}
            onClick={() => setActiveTab('pupils')}
            style={{
              borderBottom: activeTab === 'pupils' ? '1px solid black' : 'none',
            }}>
            Pupils
          </span>
          <span
            className={styles.tab_text}
            onClick={() => setActiveTab('subjects')}
            style={{
              borderBottom: activeTab === 'subjects' ? '1px solid black' : 'none',
            }}>
            Subjects
          </span>
        </div>
        <div className={styles.nav_right_block}>
          <span className={styles.user_email_text}>{user?.email}</span>
          <button className={styles.logout_btn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.wrapper}>
          {activeTab === 'teachers' && <Teachers />}
          {activeTab === 'pupils' && <Pupils />}
          {activeTab === 'subjects' && <Subjects />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
