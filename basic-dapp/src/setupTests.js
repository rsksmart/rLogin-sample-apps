import Enzyme from 'enzyme'
import UnofficialSeventeenAdapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({ adapter: new UnofficialSeventeenAdapter() })
