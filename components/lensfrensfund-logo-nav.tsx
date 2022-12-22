import Image from "next/image";
import styles from "../styles/LensFrensFundLogoNav.module.css";

const LensFrensFundLogoNav = () => {
  return (
    <div className={styles.LensFrensFundContainer}>
      <Image
        unoptimized
        height="48"
        width="48"
        src="/bean.png"
        alt="lensfrensfund logo"
      ></Image>
      <span className={styles.LensFrensFundText}>Lens Frens Fund</span>
    </div>
  );
};

export default LensFrensFundLogoNav;
