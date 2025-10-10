import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
// import Loading from "../Loading/Loading";
// import Error from "../Error/Error";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearch(event.target.value),
    300
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, currentPage],
    queryFn: () => fetchNotes({ search, page: currentPage, perPage: 12 }),
  });

  if (isLoading) {
    return (
      <div>
        {/* <Loading/> */}
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {/* <Error/> */}
        Error occurred while fetching notes.
      </div>
    );
  } else {
    return (
      <>
        <div>
          <div className={css.app}>
            <header className={css.toolbar}>
              <SearchBox
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleSearch(e);
                }}
              />
              {data && data.total_pages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={data.total_pages}
                />
              )}
              <button
                className={css.button}
                onClick={() => setIsModalOpen(true)}
              >
                Create note +
              </button>
            </header>
            {isModalOpen && (
              <Modal onClose={() => setIsModalOpen(false)}>
                {/* NoteForm тут */}
              </Modal>
            )}
            {data && data.results && data.results.length > 0 && (
              <NoteList notes={data.results} />
            )}
          </div>
        </div>
      </>
    );
  }
};

export default App;
