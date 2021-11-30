import { CreateSignature } from 'src/interfaces/api/image'

const cloudinary = require('cloudinary').v2

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
