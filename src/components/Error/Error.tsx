import css from "./Error.module.css";

interface Props {
  message?: string;
}

const ErrorMessage = ({ message = "Failed to load notes" }: Props) => {
  return (
    <p className={css.text} role="alert">
      {message}
    </p>
  );
};

export default ErrorMessage;
