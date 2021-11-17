import React from 'react'

import classes from 'styles/components/avatar.module.scss'
import ProfileImage from './ProfileImage'

export type AvatarProps = {
  alt?: string
  children: React.ReactNode
  className?: string
  color?: 'default' | 'primary' | 'secondary' | 'red' | 'green'
  size?: number
  src?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const {
    alt,
    children,
    className,
    color = 'default',
    size = 40,
    src,
    ...rest
  } = props

  const classNames = [
    classes.avatar,
    classes[`color-${color}`],
    className && className,
  ]

  return (
    <div
      className={classNames.join(' ')}
      style={{ width: size, height: size }}
      ref={ref}
      {...rest}
    >
      {src ? <ProfileImage src={src} alt={alt} size={40} /> : children}
    </div>
  )
})

export default Avatar
