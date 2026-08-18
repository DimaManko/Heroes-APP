import { useHttp } from "../../hooks/http.hook";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { motion, AnimatePresence } from "motion/react";

import { deleteHero, fetchHeroes, filteredHeroesSelector } from "./heroesSlice";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
  const { heroesLoadingStatus } = useSelector((state) => state.heroes);
  // const { activeFilter } = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  const { request } = useHttp();

  const filteredHeroes = useSelector(filteredHeroesSelector);

  useEffect(() => {
    dispatch(fetchHeroes());
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

  const elements = renderHeroesList(filteredHeroes);
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
