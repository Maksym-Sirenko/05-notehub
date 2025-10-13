import { Formik, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { createNote } from "../../services/noteService";
import css from "./NoteForm.module.css";

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

interface NoteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  // onCreate: (note: Note) => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title too short")
    .max(30, "Title is too long")
    .required("Title is required"),

  content: Yup.string().max(500, "Content is too long"),

  tag: Yup.string().oneOf(TAGS, "Invalid tag").required("Tag is required"),
});

const NoteForm = ({ onClose, onSuccess }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const fieldId = useId();

  const { mutate: createMutate } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.();
    },
  });

  const handleSubmit = async (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    await createMutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnBlur
      validateOnChange
    >
      {({ isSubmitting }) => (
        <form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>
            <Field
              id={`&{fieldId}-title`}
              type="text"
              name="title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>
          <div className={css.formGroup}></div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>
            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>
            <Field
              as="select"
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default NoteForm;
