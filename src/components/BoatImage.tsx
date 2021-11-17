import { Image } from 'cloudinary-react'

export default function BoatImage({
  src,
  alt = 'Take a good hard look at this boat',
  ...rest
}: {
  src: string
  alt?: string
} & React.ComponentPropsWithoutRef<Image>) {
  if (src.includes('cloudinaryPublicId=')) {
    const publicId = src.replace('cloudinaryPublicId=', '')

    return (
      <Image
        cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
        publicId={publicId}
        secure
        alt={alt}
        {...rest}
      />
    )
  }

  return <img src={src} alt={alt} {...rest} />
}
