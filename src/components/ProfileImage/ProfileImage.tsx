import React from 'react'
import { AdvancedImage } from '@cloudinary/react'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity'
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn'

import cld from 'lib/cloudinary'
import classes from './ProfileImage.module.scss'

export type ProfileImageProps = {
  src?: string | null
  alt?: string
  size?: number
  children?: React.ReactNode
}

const ProfileImage = React.forwardRef<HTMLDivElement, ProfileImageProps>(
  (props, ref) => {
    const {
      alt = 'Profile picture',
      size = 120,
      src,
      children,
      ...rest
    } = props

    if (src && src.includes('cloudinaryPublicId=')) {
      const img = cld
        .image(src.replace('cloudinaryPublicId=', ''))
        .resize(fill().width(250).height(250).gravity(focusOn(FocusOn.faces())))

      return (
        <div
          className={classes.image}
          style={{ '--size': `${size}px` } as React.CSSProperties}
          ref={ref}
        >
          <AdvancedImage
            width={size + 'px'}
            height={size + 'px'}
            cldImg={img}
            // secure
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
        role="img"
        aria-label={alt}
      >
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          children ?? <div className={classes.noImage}>👨</div>
        )}
      </div>
    )
  }
)

export default ProfileImage
