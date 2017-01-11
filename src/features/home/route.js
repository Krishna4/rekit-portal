import {
  DefaultPage,
  TestPage1,
  TestPage2,
  ComponentView,
} from './index';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
    { path: 'test-page-1', name: 'Test page 1', component: TestPage1 },
    { path: 'test-page-2', name: 'Test page 2', component: TestPage2 },
    { path: 'component-view', name: 'Component view', component: ComponentView },
  ],
};
