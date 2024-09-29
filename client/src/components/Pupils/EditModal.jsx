import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import Select from 'react-select';
import { GET_SUBJECTS } from '../../graphql/queries/subjectQueries';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_PUPIL } from '../../graphql/mutations';

function EditModal({ pupil, id, setModalActive }) {
  const subjectsForSelect = pupil.subjects.map((subject) => {
    return {
      value: subject.id,
      label: subject.name,
    };
  });

  const [name, setName] = useState(pupil.name || '');
  const [grade, setGrade] = useState(pupil.grade || '');
  const [subjects, setSubjects] = useState(subjectsForSelect || []);
  const [allSubjects, setAllSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { loading, error, data } = useQuery(GET_SUBJECTS);
  const [updatePupil] = useMutation(UPDATE_PUPIL);

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

  const handleEditPupil = async (e) => {
    e.preventDefault();

    if (!name || !grade || !subjects.length) {
      setErrorMessage('Invalid name or grade or subjects length is 0');
      return;
    }

    try {
      await updatePupil({
        variables: {
          id,
          name,
          grade: Number(grade),
          subjectIds: subjects.map((subject) => subject.value),
        },
      });
      setModalActive(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading subjects</p>;

  return (
    <div className={styles.modal_container} onClick={() => setModalActive(false)}>
      <div className={styles.modal_wrapper} onClick={(e) => e.stopPropagation()}>
        <form className={styles.form} onSubmit={handleEditPupil}>
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
              defaultValue={subjectsForSelect}
              isMulti
              name="subjects"
              isClearable={false}
              isSearchable={false}
              options={allSubjects}
              onChange={(value) => {
                console.log(value);
                setSubjects(value);
              }}
            />
          </div>
          <div>
            <span className={styles.error_messae}>{errorMessage || ''}</span>
          </div>
          <div className={styles.btn_wrapper}>
            <button className={styles.btn} type="submit">
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
