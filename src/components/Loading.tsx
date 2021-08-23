export type LoadingType = {
  fullscreen?: boolean
  className?: string
}

export default function Loading({ fullscreen, className }: LoadingType) {
  const classNames = [
    'loading__boat',
    className,
    fullscreen ? 'loading__boat--fullscreen' : '',
  ]
  const classNameString = classNames.filter(i => !!i).join(' ')

  return <div className={classNameString}>🛥️</div>
}
