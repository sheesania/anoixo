import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { enableFetchMocks } from 'jest-fetch-mock'
configure({ adapter: new Adapter() });
enableFetchMocks();

// Fix for popper.js calling createRange which is not available in jsdom.
// See https://github.com/popperjs/popper-core/issues/478 and https://stackoverflow.com/a/60616862
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});