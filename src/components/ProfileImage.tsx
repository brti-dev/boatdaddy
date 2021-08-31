import classes from 'styles/components/profile-image.module.scss'

export default function ProfileImage({ src }: { src: string | null }) {
  return (
    <div className={classes.image}>
      {src ? <img src={src} /> : <div className={classes.noImage}>👨</div>}
    </div>
  )
}
