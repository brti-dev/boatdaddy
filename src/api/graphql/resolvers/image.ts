import { CreateSignature } from 'interfaces/api/image'
import cloudinary from 'lib/cloudinary'

// Add auth
function createImageSignature(): CreateSignature {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature: string = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_SECRET
  )

  return { timestamp, signature }
}

export default { createImageSignature }
