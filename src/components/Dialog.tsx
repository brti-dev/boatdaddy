import { Dialog } from '@reach/dialog'

import classnames from 'lib/classnames'
import VisuallyHidden from 'components/VisuallyHidden'
import { IconButton, IconButtonProps } from 'components/Button'

export default Dialog

export function CloseButton({
  className,
  ...props
}: Omit<IconButtonProps, 'children'>) {
  return (
    <IconButton
      variant="close"
      className={classnames('close-button', className)}
      {...props}
    >
      <VisuallyHidden>Close</VisuallyHidden>
      <span aria-hidden>×</span>
    </IconButton>
  )
}
