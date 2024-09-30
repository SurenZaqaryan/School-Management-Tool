import React, { useCallback, useEffect, useState } from 'react';
import styles from './style.module.css';
import Select from 'react-select';
import { GET_SUBJECTS } from '../../graphql/queries/teacherQueries';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TEACHER } from '../../graphql/mutations';

function Modal({ setModalActive, refetchTeachers }) {
  const [values, setValues] = useState({ id: '', name: '', subjects: [] });
  const [subjects, setSubjects] = useState([]);
  const [errorClient, setErrorClient] = useState('');
  const { data, loading, error } = useQuery(GET_SUBJECTS);
  const [addTeacher] = useMutation(ADD_TEACHER);

  useEffect(() => {
    if (data) {
      setSubjects(
        data.getSubjects.map((subject) => {
          return { value: subject.id, label: subject.name };
        }),
      );
    }
  }, [data]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!values.name || values.subjects.length === 0) {
        setErrorClient('invalid teacher name or 0 subjects');
        return;
      }

      try {
        const subjectIds = values.subjects.map((subject) => subject.value);
        await addTeacher({ variables: { name: values.name, subjectIds } });
        refetchTeachers();
        setModalActive(false);
      } catch (err) {
        console.log(err);
      }
    },
    [addTeacher, refetchTeachers, setModalActive, values],
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.modal_container} onClick={() => setModalActive(false)}>
      <div className={styles.modal_wrapper} onClick={(e) => e.stopPropagation()}>
        <form className={styles.modal_form} onSubmit={handleSubmit}>
          <div className={styles.input_wrapper}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <input
              id="name"
              className={styles.input}
              type="text"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="select" className={styles.label}>
              Subjects
            </label>
            <Select
              id="select"
              value={values.subjects}
              isMulti
              name="subjects"
              isClearable={false}
              isSearchable={false}
              options={subjects}
              onChange={(value) => {
                setValues({ ...values, subjects: value });
              }}
            />
          </div>
          <div>
            <span className={styles.error_message}>{errorClient || ''}</span>
          </div>
          <button className={styles.save_btn}>Add</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
