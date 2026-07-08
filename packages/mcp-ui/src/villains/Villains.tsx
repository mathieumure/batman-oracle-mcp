import styles from './Villains.module.css';
import { Slider, SliderCard } from '../components/slider';

export type Villain = {
  name: string;
  picture: string;
};

type Props = {
  villains: Array<Villain>;
};

export const Villains = ({ villains }: Props) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gotham's Most Wanted</h1>
      <Slider>
        {villains?.map((villain) => (
          <SliderCard key={villain.name} name={villain.name} picture={villain.picture} />
        ))}
      </Slider>
    </div>
  );
};
