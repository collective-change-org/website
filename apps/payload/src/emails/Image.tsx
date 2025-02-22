import { Img } from '@react-email/components'

export const Image = (props: { scr: string; alt: string; width: number; height: number }) => {
  return <Img src={props.scr} alt={props.alt} width={props.width} height={props.height} />
}
