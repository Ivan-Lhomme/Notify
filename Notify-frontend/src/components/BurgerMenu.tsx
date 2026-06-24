import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import UpperBarButtons from "./UpperBarButtons";
import type { BurgerMenuProps } from "../utils/PropsType";
import { useState } from "react";

export default function BurgerMenu({
  setRoute,
  setSearch,
  styles,
  artistRef,
  adminRef,
}: BurgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {isMenuOpen ? (
        <>
          <div onClick={() => closeMenu()} className={styles["hiddenMenu"]} />

          <div
            className={`${styles.sideMenu} ${
              isMenuOpen ? styles.sideMenuOpen : ""
            }`}
          >
            <RxCross1
              color="white"
              size={40}
              onClick={() => closeMenu()}
              className={styles.burgerCross}
            />

            <UpperBarButtons
              setRoute={setRoute}
              setSearch={setSearch}
              styles={styles}
              artistRef={artistRef}
              adminRef={adminRef}
              closeMenu={closeMenu}
            />
          </div>
        </>
      ) : (
        <RxHamburgerMenu
          color="white"
          size={40}
          onClick={() => openMenu()}
          className={styles["burgerMenu"]}
        />
      )}
    </>
  );
}
