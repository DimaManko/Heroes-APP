import { useDispatch, useSelector } from "react-redux";
import { fetchFilter } from "../../actions";
import { activeFilterChange } from "./filtersSlice";
import { useHttp } from "../../hooks/http.hook";
import classNames from "classnames";

import Spinner from "../spinner/Spinner";
import { useEffect } from "react";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
  const { filters, filtersLoadingStatus, activeFilter } = useSelector(
    (state) => state.filters,
  );
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchFilter(request));
  }, []);

  if (filtersLoadingStatus === "loading") {
    return <Spinner />;
  } else if (filtersLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <p className="card-text">Отфильтруйте героев по элементам</p>
        <div className="btn-group">
          {filters.map(({ name, label }) => {
            const btnClass = classNames({
              btn: true,
              "btn-outline-dark": name === "all",
              "btn-danger": name === "fire",
              "btn-primary": name === "water",
              "btn-success": name === "wind",
              "btn-secondary": name === "earth",
              active: activeFilter === name,
            });
            return (
              <button
                key={name}
                className={btnClass}
                onClick={() => dispatch(activeFilterChange(name))}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroesFilters;
