import { AdvancedImage } from '@cloudinary/react'
import { fill } from '@cloudinary/url-gen/actions/resize'

import cld from 'lib/cloudinary'

export type BoatImageProps = {
  src: string
  alt?: string
  height?: number
  width?: number
  [x: string]: any
}

export default function BoatImage({
  src,
  alt = 'Take a good hard look at this boat',
  ...props
}: BoatImageProps): JSX.Element {
  // console.log('BoatImage', src, alt, props)
  const { width, height, ...rest } = props

  if (src.includes('cloudinaryPublicId=')) {
    let img = cld
      .image(src.replace('cloudinaryPublicId=', ''))
      .quality(rest.quality || 'auto')

    if (width || height) img = img.resize(fill().width(width).height(height))

    return <AdvancedImage alt={alt} cldImg={img} />
  }

  return (
    <img
      src={src}
      alt={alt}
      width={!!width && width + 'px'}
      height={!!height && height + 'px'}
      {...rest}
    />
  )
}
