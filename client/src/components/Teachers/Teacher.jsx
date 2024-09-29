import React from 'react';
import styles from '../Teachers/style.module.css';
import { useMutation } from '@apollo/client';
import { DELETE_TEACHER } from '../../graphql/mutations';

function Teacher({ teacher, setModalActive, refetch }) {
  const [deleteTeacher] = useMutation(DELETE_TEACHER);

  const handleDelete = async () => {
    try {
      await deleteTeacher({ variables: { id: teacher.id } });
      refetch();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <div className={styles.teacher}>
      <span>{teacher.name}</span>

      {!!teacher.subjects.length && (
        <div className={styles.subjects_wrapper}>
          <h5 className={styles.subject_title}>Subjects</h5>
          <ul className={styles.subjects_list}>
            {teacher.subjects.map((subject, index) => {
              return <li key={subject.id}>{`${index + 1}. ` + subject.name}</li>;
            })}
          </ul>
        </div>
      )}

      <div className={styles.teacher_actions}>
        <span className={styles.teacher_edit_btn} onClick={() => setModalActive(teacher.id)}>
          Edit
        </span>
        <span className={styles.teacher_remove_btn} onClick={handleDelete}>
          Remove
        </span>
      </div>
    </div>
  );
}

export default Teacher;
