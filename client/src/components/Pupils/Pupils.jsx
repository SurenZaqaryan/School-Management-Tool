import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { GET_PUPILS_WITH_SUBJECTS } from '../../graphql/queries/pupilQueries';
import Pupil from './Pupil';
import styles from './style.module.css';
import AddModal from './AddModal';

function Pupils() {
  const [isModalActive, setModalActive] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_PUPILS_WITH_SUBJECTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <div className={styles.pupils_wrapper}>
        <div className={styles.add_pupil_wrapper}>
          <button className={styles.add_pupil_button} onClick={() => setModalActive(true)}>
            Add Pupil
          </button>
        </div>
        <div className={styles.titles_wrapper}>
          <h4 className={styles.item}>Name</h4>
          <h4 className={styles.item}>Grade</h4>
          <h4 className={styles.item}>Subjects</h4>
          <h4 className={styles.item}>Actions</h4>
        </div>
        {data.getPupils.map((pupil) => {
          return <Pupil key={pupil.id} pupil={pupil} refetch={refetch} />;
        })}
      </div>
      {isModalActive && <AddModal setModalActive={setModalActive} refetch={refetch} />}
    </>
  );
}

export default Pupils;
