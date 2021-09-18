import React, { useState } from 'react'

import classes from 'styles/components/check-button.module.scss'
import makeRandomString from 'src/lib/make-random-string'

export const checkButtonContainerClass = classes.container

export type CheckButtonType = {
  name: string
  value: string
  checked?: boolean
  id?: string
  onChange?: (value: boolean) => void
  children: React.ReactElement | string
}

export default function CheckButton({
  name,
  value,
  checked = false,
  id,
  onChange = null,
  children,
}: CheckButtonType) {
  const [isChecked, setChecked] = useState(checked)
  const toggleChecked = () => {
    setChecked(!isChecked)
    if (onChange) {
      onChange(!isChecked)
    }
  }

  if (!id) {
    id = `checkButton__${name}__${makeRandomString()}`
  }

  return (
    <div className={classes.checkButton}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={isChecked}
        id={id}
        className="visually-hidden"
        onChange={toggleChecked}
      />
      <label htmlFor={id} className="button">
        {children}
      </label>
    </div>
  )
}