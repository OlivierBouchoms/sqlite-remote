import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app.tsx';
import './localization/i18n';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
