import React from 'react'
import { Image } from 'cloudinary-react'

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
    const publicId = src.replace('cloudinaryPublicId=', '')

    return (
      <Component
        className={classes.image}
        style={{ '--size': `${size}px` } as React.CSSProperties}
        ref={ref}
      >
        <Image
          cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
          publicId={publicId}
          secure
          alt={alt}
          {...rest}
        />
      </Component>
    )
  }

  return (
    <Component
      className={classes.image}
      style={{ '--size': `${size}px` } as React.CSSProperties}
      ref={ref}
      role="img"
    >
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        children ?? (
          <div aria-label={alt} className={classes.noImage}>
            👨
          </div>
        )
      )}
    </Component>
  )
})

export default ProfileImage
