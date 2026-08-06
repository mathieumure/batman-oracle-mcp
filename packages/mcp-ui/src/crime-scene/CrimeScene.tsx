import styles from './CrimeScene.module.css';
import type { CrimeScene as CrimeSceneData } from '@batman/data/crime-scene.js';

type Props = {
  crimeScene: CrimeSceneData;
};

type IconProps = { className?: string };

const IconFingerprint = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3a9 9 0 0 1 9 9c0 1.5-.3 2.9-.8 4.2" />
    <path d="M6.2 5.6A9 9 0 0 0 3 12c0 1.8.4 3.4 1.1 4.9" />
    <path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5c0 2-.5 3.6-1.2 4.9" />
    <path d="M8.8 7.6A5.5 5.5 0 0 0 6.5 12c0 2.6.8 4.6 1.8 6.1" />
    <path d="M12 10a2 2 0 0 1 2 2c0 3-1 5.4-2.3 7.3" />
    <path d="M10.3 10.7A2 2 0 0 0 10 12c0 2.7.7 4.8 1.6 6.6" />
  </svg>
);

const IconDroplet = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3c3.5 4 6 7.4 6 10.5a6 6 0 0 1-12 0C6 10.4 8.5 7 12 3z" />
  </svg>
);

const IconMolecule = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="18" cy="7" r="2.2" />
    <circle cx="10" cy="18" r="2.2" />
    <line x1="7.9" y1="7.1" x2="16.1" y2="7.4" />
    <line x1="6.9" y1="8.1" x2="9.4" y2="16" />
    <line x1="16.6" y1="8.9" x2="11.3" y2="16.3" />
  </svg>
);

const IconTag = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 11.5 11.5 3H19a2 2 0 0 1 2 2v7.5L12.5 21 3 11.5z" />
    <circle cx="15.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const CrimeScene = ({ crimeScene }: Props) => {
  return (
    <div className={styles.stage}>
      <div className={styles.file}>
        <div className={styles.tab}>Dossier GCPD</div>
        <div className={styles.stamp}>Confidentiel</div>

        <header className={styles.header}>
          <IconFingerprint className={styles.watermark} />
          <h1 className={styles.heading}>Rapport de scène de crime</h1>
          <p className={styles.description}>{crimeScene.description}</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.finding}>
            <IconFingerprint className={crimeScene.fingerprintsFound ? styles.iconActive : styles.iconInactive} />
            <div>
              <p className={styles.findingLabel}>Empreintes</p>
              <p className={styles.findingValue}>{crimeScene.fingerprintsFound ? 'Relevées' : 'Aucune'}</p>
              {crimeScene.fingerprintsFound && crimeScene.fingerprintsDetails && (
                <p className={styles.findingDetail}>{crimeScene.fingerprintsDetails}</p>
              )}
            </div>
          </div>

          <div className={styles.finding}>
            <IconDroplet className={crimeScene.bloodTraces ? styles.iconActive : styles.iconInactive} />
            <div>
              <p className={styles.findingLabel}>Traces de sang</p>
              <p className={styles.findingValue}>{crimeScene.bloodTraces ? 'Présentes' : 'Aucune'}</p>
              {crimeScene.bloodTraces && crimeScene.bloodTracesDetails && (
                <p className={styles.findingDetail}>{crimeScene.bloodTracesDetails}</p>
              )}
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <IconMolecule className={styles.sectionIcon} />
            Résidus d'analyse
          </h2>
          <ul className={styles.evidenceList}>
            {crimeScene.residues.map((residue) => (
              <li key={residue}>{residue}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <IconTag className={styles.sectionIcon} />
            Pièces à conviction
          </h2>
          <ul className={styles.evidenceList}>
            {crimeScene.exhibits.map((exhibit) => (
              <li key={exhibit}>{exhibit}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
