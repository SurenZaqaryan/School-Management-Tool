import React, { useCallback, useState } from 'react';
import styles from './style.module.css';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_SUBJECT } from '../../graphql/mutations';
import { GET_SUBJECTS } from '../../graphql/queries/subjectQueries';
import Subject from './Subject';

function Subjects() {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createSubject] = useMutation(ADD_SUBJECT);
  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_SUBJECTS);

  const handleAddSubject = useCallback(
    async (e) => {
      e.preventDefault();

      if (!name) {
        setErrorMessage('Invalid subject name!');
        setSuccessMessage('');
        return;
      }

      try {
        await createSubject({
          variables: { name },
        });
        setName('');
        setErrorMessage('');
        setSuccessMessage('Subject is successfully added');
        refetch();
      } catch (err) {
        setSuccessMessage('');
        console.log(err);
        if (err.message.includes('name_UNIQUE')) {
          setErrorMessage('Subject name is already taken');
        } else {
          setErrorMessage(err.message);
        }
      }
    },
    [name, createSubject, refetch],
  );

  const handleChangeSubjectName = useCallback((e) => {
    setName(e.target.value);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className={styles.pupils_wrapper}>
        <div className={styles.add_subject_wrapper}>
          <form onSubmit={handleAddSubject}>
            <div className={styles.input_wrapper}>
              <label className={styles.label} htmlFor="name">
                Name
              </label>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={handleChangeSubjectName}
              />
            </div>

            <button type="submit" className={styles.add_subject_button}>
              Add Subject
            </button>
            <div className={styles.error_message_wrapper}>
              <span className={styles.error_message}>{errorMessage || ''}</span>
              {successMessage && <span className={styles.success_message}>{successMessage}</span>}
            </div>
          </form>
        </div>
        <div className={styles.titles_wrapper}>
          <h4 className={styles.item}>Name</h4>
          <h4 className={styles.item}>Actions</h4>
        </div>
        {data.getSubjects.map((subject) => (
          <Subject key={subject.id} subject={subject} refetch={refetch} />
        ))}
      </div>
    </>
  );
}

export default Subjects;
