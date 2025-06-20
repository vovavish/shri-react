import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import logo from '../../assets/logo.svg';
import upload from '../../assets/mage_upload.svg';
import generator from '../../assets/oui_ml-create-multi-metric-job.svg';
import history from '../../assets/solar_history-linear.svg';

import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo_wrapper}>
        <img src={logo} alt="Логотип" />
        <div className={styles.logo_title}>Межгалактическая аналитика</div>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.nav_list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? classNames(styles.nav_list__link, styles.nav_list__link_active)
                  : styles.nav_list__link
              }
            >
              <img src={upload} className={styles.nav_list__link_img} />
              <div>CSV Аналитик</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/generator"
              className={({ isActive }) =>
                isActive
                  ? classNames(
                      styles.nav_list__link,
                      styles.nav_list__link_active,
                      styles.nav_list__link_more_space,
                    )
                  : classNames(styles.nav_list__link, styles.nav_list__link_more_space)
              }
            >
              <img src={generator} className={styles.nav_list__link_img} />
              <div>CSV Генератор</div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive
                  ? classNames(styles.nav_list__link, styles.nav_list__link_active)
                  : styles.nav_list__link
              }
            >
              <img src={history} className={styles.nav_list__link_img} />
              <div>История</div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};
