import React, { useCallback, useEffect, useState } from 'react';
import styles from './style.module.css';
import Select from 'react-select';
import { GET_SUBJECTS } from '../../graphql/queries/subjectQueries';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PUPIL } from '../../graphql/mutations';

function AddModal({ refetch, setModalActive }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { loading, error, data } = useQuery(GET_SUBJECTS);
  const [addPupil] = useMutation(ADD_PUPIL);

  useEffect(() => {
    if (data) {
      setAllSubjects(
        data.getSubjects.map((subject) => {
          return {
            value: subject.id,
            label: subject.name,
          };
        }),
      );
    }
  }, [data]);

  const handleAddPupil = useCallback(
    async (e) => {
      e.preventDefault();

      if (!name || !grade || !subjects.length) {
        setErrorMessage('Invalid name or grade or subjects length is 0');
        return;
      }

      try {
        await addPupil({
          variables: {
            name,
            grade: Number(grade),
            subjectIds: subjects.map((subject) => subject.value),
          },
        });
        setModalActive(false);
        refetch();
      } catch (err) {
        console.error('Error', err);
      }
    },
    [addPupil, grade, name, refetch, setModalActive, subjects],
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;

  return (
    <div className={styles.modal_container} onClick={() => setModalActive(false)}>
      <div className={styles.modal_wrapper} onClick={(e) => e.stopPropagation()}>
        <form className={styles.form} onSubmit={handleAddPupil}>
          <div className={styles.input_wrapper}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              className={styles.input}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.input_wrapper}>
            <label className={styles.label} htmlFor="grade">
              Grade
            </label>
            <input
              className={styles.input}
              type="text"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>
          <div className={styles.input_wrapper}>
            <label className={styles.label} htmlFor="select">
              Subjects
            </label>
            <Select
              id="select"
              value={subjects}
              isMulti
              name="subjects"
              isClearable={false}
              isSearchable={false}
              options={allSubjects}
              onChange={(value) => {
                setSubjects(value);
              }}
            />
          </div>
          <div>
            <span className={styles.error_messae}>{errorMessage || ''}</span>
          </div>
          <div className={styles.btn_wrapper}>
            <button className={styles.btn} type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;
