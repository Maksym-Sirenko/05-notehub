import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
// import Modal from "../Modal/Modal";
// import Loading from "../Loading/Loading";
// import Error from "../Error/Error";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // const handleSearch = useDebouncedCallback(setSearch, 600);

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setSearch(event.target.value),
    600
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);

  const { data, isSuccess, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", search, currentPage],
    queryFn: () => fetchNotes({ search, page: currentPage, perPage: 12 }),
    placeholderData: keepPreviousData,
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
  }

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
            {data && data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={data.totalPages}
              />
            )}
            <button className={css.button} onClick={openModal}>
              Create note +
            </button>
          </header>

          {isModalOpen && (
            <Modal onClose={closeModal}>
              <NoteForm onClose={closeModal} />
            </Modal>
          )}
          {data && isSuccess && data.notes && data.notes.length > 0 && (
            <NoteList notes={data.notes} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
