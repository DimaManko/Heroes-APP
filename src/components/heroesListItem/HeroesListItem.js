import { motion } from "motion/react";

const HeroesListItem = ({ hero, deleteHero }) => {
  const { id, name, description, element } = hero;
  let elementClassName;

  switch (element) {
    case "fire":
      elementClassName = "bg-danger bg-gradient";
      break;
    case "water":
      elementClassName = "bg-primary bg-gradient";
      break;
    case "wind":
      elementClassName = "bg-success bg-gradient";
      break;
    case "earth":
      elementClassName = "bg-secondary bg-gradient";
      break;
    default:
      elementClassName = "bg-warning bg-gradient";
  }

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      layout
      className={`card flex-row mb-4 shadow-lg text-white ${elementClassName}`}
    >
      <img
        src="https://t4.ftcdn.net/jpg/14/20/16/23/360_F_1420162341_QYUbE0Zlxv1bJpprhXmEOBrThAdQfu9i.jpg"
        className="img-fluid w-25 d-inline"
        alt="unknown hero"
        style={{ objectFit: "cover" }}
      />
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-text">{description}</p>
      </div>
      <span className="position-absolute top-0 start-100 translate-middle badge border rounded-pill bg-light">
        <button
          onClick={() => deleteHero(id)}
          type="button"
          className="btn-close btn-close"
          aria-label="Close"
        ></button>
      </span>
    </motion.li>
  );
};

export default HeroesListItem;
