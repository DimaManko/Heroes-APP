import { useHttp } from "../../hooks/http.hook";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { motion, AnimatePresence } from "motion/react";

import {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  deleteHero,
} from "../../actions";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
  const { heroes, heroesLoadingStatus, activeFilter } = useSelector(
    (state) => state,
  );
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
      .then((data) => dispatch(heroesFetched(data)))
      .catch(() => dispatch(heroesFetchingError()));

    // eslint-disable-next-line
  }, []);

  const onDelete = useCallback(
    (id) => {
      request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then(() => dispatch(deleteHero(id)))
        .catch(() => console.log("Не удалось удалить персонажа"));
    },
    [request, dispatch],
  );

  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderHeroesList = (arr) => {
    const filteredHeroes =
      activeFilter === "all"
        ? arr
        : arr.filter((hero) => hero.element === activeFilter);

    if (filteredHeroes.length === 0) {
      return <h5 className="text-center mt-5">Героев пока нет</h5>;
    }

    return (
      <AnimatePresence>
        {filteredHeroes.map((hero) => {
          return (
            <HeroesListItem key={hero.id} hero={hero} deleteHero={onDelete} />
          );
        })}
      </AnimatePresence>
    );
  };

  const elements = renderHeroesList(heroes);
  return (
    <motion.ul
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {elements}
    </motion.ul>
  );
};

export default HeroesList;
