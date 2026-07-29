import styles from './Criminals.module.css';
import { Slider, SliderCard } from '../components/slider';

export type Criminal = {
  name: string;
  picture: string;
};

type Props = {
  criminals: Array<Criminal>;
};

export const Criminals = ({ criminals }: Props) => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Gotham's Most Wanted</h1>
      <Slider>
        {criminals?.map((criminal) => (
          <SliderCard key={criminal.name} name={criminal.name} picture={criminal.picture} />
        ))}
      </Slider>
    </div>
  );
};
