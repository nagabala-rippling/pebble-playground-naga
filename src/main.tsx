import { initI18nTranslations } from '@rippling/lib-i18n';
import oneUiService from '@rippling/pebble/services';
import { ThemeProvider, THEME_CONFIGS } from '@rippling/pebble/theme';
import resources from '@rippling/pebble/translations/locales/en-US/one-ui.json';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyle from '@rippling/pebble/GlobalStyle';

import AppShellTemplate from './demos/app-shell-template';
import CompositionManagerDemo from './demos/composition-manager/composition-manager-demo';
import { CompositionDetail } from './demos/composition-manager/compositions/CompositionDetail';
import IndexPage from './demos/index-page';
import GettingStartedPage from './demos/getting-started-page';
import DocViewerPage from './demos/doc-viewer-page';
import CanadaBulkRoeDemo from './demos/canada-bulk-roe-demo';
import PayrollRegisterReportDemo from './demos/payroll-register-report-demo';
import EmployeePayRunTablesDemo from './demos/employee-pay-run-tables-demo';
import EntitySwitcherDemo from './demos/entity-switcher/entity-switcher-demo';
import PaySchedulesDemo from './demos/pay-schedules/pay-schedules-demo';

oneUiService.init({} as any);

const defaultNameSpace = 'one-ui';
const namespaces = [defaultNameSpace];
const language = 'en-US';
const supportedLanguages = [language];

function init() {
  return initI18nTranslations({
    resources: {
      [language]: {
        [defaultNameSpace]: resources,
      },
    },
    namespaces,
    supportedLanguages,
    defaultNameSpace,
    fallbackLanguage: language,
    language,
    debug: true,
  });
}

const container = document.getElementById('root') as HTMLElement;

let root = (window as any).__root__;
if (!root) {
  root = ReactDOM.createRoot(container);
  (window as any).__root__ = root;
}

init().then(() => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider themeConfigs={THEME_CONFIGS} defaultTheme="berry" defaultColorMode="light">
          <GlobalStyle />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/getting-started" element={<GettingStartedPage />} />
            <Route path="/docs" element={<DocViewerPage />} />
            <Route path="/app-shell-template" element={<AppShellTemplate />} />
            <Route path="/composition-manager" element={<CompositionManagerDemo />} />
            <Route path="/composition-manager/compositions/:id" element={<CompositionDetail />} />
            <Route path="/canada-bulk-roe" element={<CanadaBulkRoeDemo />} />
            <Route path="/payroll-register-report" element={<PayrollRegisterReportDemo />} />
            <Route path="/employee-pay-run-tables" element={<EmployeePayRunTablesDemo />} />
            <Route path="/entity-switcher" element={<EntitySwitcherDemo />} />
            <Route path="/pay-schedules" element={<PaySchedulesDemo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  );
});
