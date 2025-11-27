import { Outlet } from 'react-router-dom';
import NavigationMenu from '../components/navigation';
import Sidebar from '../components/sidebar';
import styles from './root.module.css';
import { DatabaseConfigurationContextProvider } from '../context/databaseConfigurationContext.tsx';
import { useAppLayout } from '../context/appLayoutContext.tsx';

export default function RootPage() {
    const { registerLayout } = useAppLayout();

    return (
        <DatabaseConfigurationContextProvider>
            <div className={styles.layout} ref={(e) => registerLayout(e)}>
                <NavigationMenu />
                <Outlet />
                <Sidebar />
            </div>
        </DatabaseConfigurationContextProvider>
    );
}
