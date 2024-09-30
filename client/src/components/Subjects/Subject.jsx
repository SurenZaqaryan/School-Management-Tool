import React, { useCallback, useState } from 'react';
import styles from './style.module.css';
import { DELETE_SUBJECT, UPDATE_SUBJECT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

function Subject({ subject, refetch }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteSubject] = useMutation(DELETE_SUBJECT);
  const [editedName, setEditedName] = useState(subject.name);
  const [updateSubject] = useMutation(UPDATE_SUBJECT);

  const handleDeleteSubject = useCallback(async () => {
    try {
      await deleteSubject({
        variables: { id: subject.id },
      });
      refetch();
    } catch (err) {
      alert(err.message);
    }
  }, [deleteSubject, subject.id, refetch]);

  const handleChangeName = useCallback((e) => {
    setEditedName(e.target.value);
  }, []);

  const handleSaveUpdates = useCallback(async () => {
    if (!editedName) {
      alert('invalid name');
      return;
    }

    try {
      await updateSubject({
        variables: { id: subject.id, name: editedName },
      });
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
    }
  }, [editedName, updateSubject, subject.id]);

  return (
    <div className={styles.titles_wrapper}>
      {isEditMode ? (
        <input type="text" value={editedName} onChange={handleChangeName} />
      ) : (
        <span className={styles.item}>{subject?.name}</span>
      )}
      <div className={`${styles.item} ${styles.action_btns_wrapper}`}>
        {isEditMode ? (
          <div className={`${styles.item} ${styles.action_btns_wrapper}`}>
            <button className={styles.action_btn_save} onClick={handleSaveUpdates}>
              Save
            </button>
            <button
              className={styles.action_btn_cancel}
              onClick={() => {
                setIsEditMode(false);
                setEditedName(subject.name);
              }}>
              Cancel
            </button>
          </div>
        ) : (
          <button className={styles.action_btn} onClick={() => setIsEditMode(true)}>
            Edit
          </button>
        )}
        <button className={styles.action_btn} onClick={handleDeleteSubject}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Subject;
