import { useState } from "react";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";

const App = () => {
  return (
    <>
      <div>
        <div className={css.app}>
          <header className={css.toolbar}>
            <SearchBox onChange={() => {}} value="inputValue" />
            {/* Пагінація */}
            {/* Кнопка створення нотатки */}
          </header>
        </div>
      </div>
    </>
  );
};

export default App;
