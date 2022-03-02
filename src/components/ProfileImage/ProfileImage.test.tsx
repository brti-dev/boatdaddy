import '@testing-library/jest-dom'

import { render } from '../../../test-utils'
import ProfileImage from './ProfileImage'
import Avatar from 'components/Avatar'

test('should render initials and label properly', () => {
  const { getByText } = render(
    <ProfileImage alt="Barry Lyndon">BL</ProfileImage>
  )

  expect(getByText('BL')).toHaveAttribute('aria-label', 'Barry Lyndon')
})

test('should render an image from Cloudinary', () => {
  const alt = 'Red Shorts Daddy'
  const src = 'cloudinaryPublicId=hero_redshortsdaddy_khqgav'
  const { getByRole } = render(<ProfileImage alt={alt} src={src} />)

  const img = getByRole('img')
  expect(img).toHaveAttribute('alt', alt)
})

test('should size correctly by default', () => {
  const { getByText } = render(<ProfileImage alt="a">a</ProfileImage>)

  expect(getByText('a')).toHaveStyle({ '--size': '120px' })
})

test('should size correctly when given a `size` value', () => {
  const { getByText } = render(
    <ProfileImage alt="b" size={40}>
      b
    </ProfileImage>
  )

  expect(getByText('b')).toHaveStyle({ '--size': '40px' })
})

test('should overload element root when given `as` prop', () => {
  const { getByText } = render(
    <ProfileImage alt="foo" as={Avatar}>
      BL
    </ProfileImage>
  )

  expect(getByText('BL')).toHaveClass('avatar')
})
