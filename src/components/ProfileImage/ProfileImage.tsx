import React from 'react'
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from '@cloudinary/url-gen'
import { thumbnail } from '@cloudinary/url-gen/actions/resize'

import {
  OverloadedElement,
  OverloadedElementProps,
} from 'interfaces/OverloadedElement'
import classes from './ProfileImage.module.scss'

export type ProfileImageProps = {
  src?: string | null
  alt?: string
  size?: number
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<Image> &
  OverloadedElementProps

const ProfileImage: OverloadedElement<ProfileImageProps> = React.forwardRef<
  HTMLDivElement,
  ProfileImageProps
>((props, ref) => {
  const {
    alt = 'Profile picture',
    as: Component = 'div',
    size = 120,
    src,
    children,
    ...rest
  } = props

  if (src && src.includes('cloudinaryPublicId=')) {
    const cld = new Cloudinary({
      cloud: {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      },
    })
    const img = cld.image(src.replace('cloudinaryPublicId=', ''))
    img.resize(thumbnail().width(size).height(size))

    return (
      <Component
        className={classes.image}
        style={{ '--size': `${size}px` } as React.CSSProperties}
        ref={ref}
      >
        <AdvancedImage cldImg={img} secure alt={alt} {...rest} />
      </Component>
    )
  }

  return (
    <Component
      className={classes.image}
      style={{ '--size': `${size}px` } as React.CSSProperties}
      ref={ref}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        children ?? <div className={classes.noImage}>👨</div>
      )}
    </Component>
  )
})

export default ProfileImage
