//const sanityConfig = require('../sanity.json')
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder({
  projectId: '69l8b8xl',
  dataset: 'production',
})

export function imageUrl(source) {
  return builder.image(source)
}

export default imageUrl
