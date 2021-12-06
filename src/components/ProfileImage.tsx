import { Image } from 'cloudinary-react'
import React from 'react'

import classes from 'src/styles/components/profile-image.module.scss'

export type ProfileImageProps = {
  src?: string | null
  alt?: string
  size?: number
} & React.ComponentPropsWithoutRef<Image>

const ProfileImage = React.forwardRef<HTMLDivElement, ProfileImageProps>(
  (props, ref) => {
    const { src, alt = 'Profile picture', size = 120, ...rest } = props

    if (src && src.includes('cloudinaryPublicId=')) {
      const publicId = src.replace('cloudinaryPublicId=', '')

      return (
        <div
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
        </div>
      )
    }

    return (
      <div
        className={classes.image}
        style={{ '--size': `${size}px` } as React.CSSProperties}
        ref={ref}
      >
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <div className={classes.noImage}>👨</div>
        )}
      </div>
    )
  }
)

export default ProfileImage
