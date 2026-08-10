import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";

import { useHttp } from "../../hooks/http.hook";
import { addHero } from "../../actions";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

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
  const { request } = useHttp();
  const dispatch = useDispatch();

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
      await request(
        "http://localhost:3001/heroes",
        "POST",
        JSON.stringify(newHero),
      );
      dispatch(addHero(newHero));
      reset();
    } catch (e) {
      console.log("Не удалось создать персонажа");
    }
  };
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
          <option value="fire">Огонь</option>
          <option value="water">Вода</option>
          <option value="wind">Ветер</option>
          <option value="earth">Земля</option>
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
