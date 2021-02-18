import Enzyme from 'enzyme'
import UnofficialSeventeenAdapter from '@wojtekmaj/enzyme-adapter-react-17'
import { TextEncoder, TextDecoder } from 'util'

Enzyme.configure({ adapter: new UnofficialSeventeenAdapter() })

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
