import styles from './SliderCard.module.css';

type Props = {
  name: string;
  picture: string;
};

export const SliderCard = ({ name, picture }: Props) => {
  return (
    <div className={styles.card}>
      <img src={picture} alt={name} className={styles.image} />
      <p className={styles.name}>{name}</p>
    </div>
  );
};
