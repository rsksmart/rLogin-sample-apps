import { mount } from 'enzyme'
import App from './App';

describe('Component: App', () => {
  test('renders learn react link', () => {
    const component = mount(<App />)
    expect(component).toBeDefined()
    expect(component.find('.App-header').text()).toBe('rLogin Sample App - Basic dApp')
  })
})
