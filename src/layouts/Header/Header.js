import React from 'react'
import { IndexLink } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div className='navigation'>
    <IndexLink activeClassName='navigation__link active' className='navigation__link' to={`/`}>Monitor</IndexLink>
    <div className='navigation__logo'>
      <img className='navigation__logo__dog'
        src='https://datadog-prod.imgix.net/img/dd_logo_70x75.png?fm=png&auto=format&lossless=1' />
      <img className='navigation__logo__text'
        src='https://datadog-prod.imgix.net/img/dd-logo-200.png?fm=png&auto=format&lossless=1' />
    </div>
    <IndexLink className='navigation__link' to={`/docs`}>Docs</IndexLink>
  </div>
)

export default Header
