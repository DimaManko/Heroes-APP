import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { motion, AnimatePresence } from "motion/react";

import { useGetHeroesQuery, useDeleteHeroMutation } from "../../api/apiSlice";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";

const HeroesList = () => {
  const { data: heroes = [], isLoading, isError } = useGetHeroesQuery();

  const [deleteHero] = useDeleteHeroMutation();

  const activeFilter = useSelector((state) => state.filters.activeFilter);

  const filteredHeroes = useMemo(() => {
    const filteredHeroes = heroes.slice();
    return activeFilter === "all"
      ? filteredHeroes
      : filteredHeroes.filter((hero) => hero.element === activeFilter);
  }, [heroes, activeFilter]);

  const onDelete = useCallback((id) => {
    deleteHero(id);
  }, []);

  if (isLoading) {
    return <Spinner />;
  } else if (isError) {
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
