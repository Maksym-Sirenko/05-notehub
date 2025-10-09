import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
// import Loading from "../Loading/Loading";
// import Error from "../Error/Error";

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedValue] = useDebounce(inputValue, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedValue, currentPage],
    queryFn: () =>
      fetchNotes({ search: debouncedValue, page: currentPage, perPage: 12 }),
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
                onChange={(e) => setInputValue(e.target.value)}
              />
              {data && data.total_pages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={data.total_pages}
                />
              )}
              {/* Кнопка створення нотатки */}
            </header>
            {data && data.results.length > 0 && (
              <NoteList notes={data.results} />
            )}
          </div>
        </div>
      </>
    );
  }
};

export default App;
