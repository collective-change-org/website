import { Field } from 'payload'
import { H1Block } from '../Headings/H1'
import { H2Block } from '../Headings/H2'
import { HeroBlock } from '../Hero'
import { LoginBlock } from '../Login'
import { ManifestBlock } from '../Manifest/config'
import { MediaBlock } from '../MediaBlock/config'
import { SignupBlock } from '../Signup'
import { IndentedContainer } from './IndentedContainer'

export const ContainerLayoutField: Field = {
  name: 'layout',
  type: 'blocks',
  blocks: [
    H1Block,
    H2Block,
    HeroBlock,
    MediaBlock,
    LoginBlock,
    SignupBlock,
    ManifestBlock,
    IndentedContainer,
  ],
  required: true,
  admin: {
    initCollapsed: true,
  },
}
