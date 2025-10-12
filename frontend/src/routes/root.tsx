import { Outlet } from 'react-router-dom';
import NavigationMenu from '../components/navigation';
import styles from './root.module.css';
import { DatabaseConfigurationContextProvider } from '../context/databaseConfigurationContext.tsx';

export default function RootPage() {
    return (
        <DatabaseConfigurationContextProvider>
            <div className={styles.layout}>
                <NavigationMenu />
                <Outlet />
            </div>
        </DatabaseConfigurationContextProvider>
    );
}
