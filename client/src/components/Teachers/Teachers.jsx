import React, { useState } from 'react';
import Teacher from './Teacher';
import styles from '../Teachers/style.module.css';
import { useQuery } from '@apollo/client';
import { GET_TEACHERS } from '../../graphql//queries/teacherQueries.js';
import EditModal from './EditModal.jsx';
import AddModal from './AddModal.jsx';

function Teachers() {
  const [isModalActive, setModalActive] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_TEACHERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.teachers}>
      <div className={styles.add_btn} onClick={() => setModalActive('add')}>
        + Add
      </div>
      {data?.getTeachers?.map((teacher) => (
        <Teacher
          setModalActive={setModalActive}
          key={teacher.id}
          teacher={teacher}
          refetch={refetch}
        />
      ))}
      {isModalActive && isModalActive !== 'add' && (
        <EditModal id={isModalActive} setModalActive={setModalActive} />
      )}
      {isModalActive === 'add' && (
        <AddModal setModalActive={setModalActive} refetchTeachers={refetch} />
      )}
    </div>
  );
}

export default Teachers;
