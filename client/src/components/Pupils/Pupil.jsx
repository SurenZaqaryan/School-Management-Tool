import React, { useState, useCallback } from 'react';
import styles from './style.module.css';
import { useMutation } from '@apollo/client';
import { DELETE_PUPIL } from '../../graphql/mutations';
import EditModal from './EditModal';

function Pupil({ pupil, refetch }) {
  const [isModalActive, setModalActive] = useState(false);
  const { id, name, grade, subjects } = pupil;
  const [deletePupil] = useMutation(DELETE_PUPIL);
  const subjectsText = subjects.map((subject) => subject.name).join(', ');

  const handleDeletePupil = useCallback(async () => {
    try {
      await deletePupil({
        variables: { id },
      });
      refetch();
      console.log('Pupil deleted successfully');
    } catch (error) {
      console.error('Error deleting pupil:', error);
    }
  }, [deletePupil, id, refetch]);
  return (
    <>
      <div className={styles.pupil_wrapper}>
        <span className={styles.item}>{name}</span>
        <span className={styles.item}>{grade}</span>
        <div className={styles.subjects_wrapper}>{subjectsText}</div>
        <div className={styles.action_btns_wrapper}>
          <button className={styles.action_btn} onClick={() => setModalActive(pupil.id)}>
            Edit
          </button>
          <button className={styles.action_btn} onClick={handleDeletePupil}>
            Delete
          </button>
        </div>
      </div>
      {isModalActive && (
        <EditModal pupil={pupil} id={isModalActive} setModalActive={setModalActive} />
      )}
    </>
  );
}

export default Pupil;
