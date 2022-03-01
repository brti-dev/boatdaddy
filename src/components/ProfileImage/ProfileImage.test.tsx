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
  const alt = 'Dan Abramov'
  const src = 'cloudinaryPublicId=hero_redshortsdaddy_khqgav'
  const { getAllByRole } = render(<ProfileImage alt={alt} src={src} />)

  const img = getAllByRole('img')
  expect(img).toHaveLength(2)
  expect(img[1]).toHaveAttribute('alt', alt)
})

test('should size correctly by default and when given a `size` value', () => {
  const { getByText } = render(
    <>
      <ProfileImage alt="a">a</ProfileImage>
      <ProfileImage alt="b" size={40}>
        b
      </ProfileImage>
    </>
  )

  expect(getByText('a')).toHaveStyle({ width: '120px' })
  expect(getByText('b')).toHaveStyle({ width: '40px' })
})

test('should overload element root when given `as` prop', () => {
  const { getByText } = render(
    <ProfileImage alt="foo" as={Avatar}>
      BL
    </ProfileImage>
  )

  expect(getByText('BL')).toHaveClass('avatar')
})
