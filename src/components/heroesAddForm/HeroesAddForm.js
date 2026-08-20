import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

import { useHttp } from "../../hooks/http.hook";

import { selectAllFilters } from "../heroesFilters/filtersSlice";
import { useCreateHeroMutation } from "../../api/apiSlice";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "This field must contain a minimum of 2 characters"),
  description: z
    .string()
    .trim()
    .min(5, "This field must contain a minimum of 5 characters"),
  element: z
    .string({ required_error: "Please select an option" })
    .min(1, "Please select an option from the list"),
});

const HeroesAddForm = () => {
  const filters = useSelector(selectAllFilters);

  const [createHero, { isLoading }] = useCreateHeroMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data) => {
    const newHero = {
      ...data,
      id: uuidv4(),
    };
    try {
      createHero(newHero).unwrap();
      reset();
    } catch (e) {
      console.log("Не удалось создать персонажа");
    }
  };

  const viewOption = (filters) => {
    if (!filters || filters.length === 0) {
      return <option value="">Фильтры загружаются...</option>;
    }

    return filters.map(({ name, label }) => {
      if (name === "all") return null;

      return (
        <option key={name} value={name}>
          {label}
        </option>
      );
    });
  };

  const option = viewOption(filters);

  return (
    <form
      className="border p-4 shadow-lg rounded"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          {...register("name")}
        />
      </div>
      {errors.name && (
        <div className="invalid-feedback d-block">{errors.name.message}</div>
      )}

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          name="text"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
          {...register("description")}
        />
      </div>
      {errors.description && (
        <div className="invalid-feedback d-block">
          {errors.description.message}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          className="form-select"
          id="element"
          name="element"
          {...register("element")}
        >
          <option value="">Я владею элементом...</option>
          {option}
        </select>
      </div>
      {errors.element && (
        <div className="invalid-feedback d-block">{errors.element.message}</div>
      )}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Загрузка.." : "Создать"}
      </button>
    </form>
  );
};

export default HeroesAddForm;
