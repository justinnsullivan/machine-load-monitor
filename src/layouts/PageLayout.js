import React from 'react'
import PropTypes from 'prop-types'
import Header from './Header/Header'

export const PageLayout = ({ children }) => (
  <div>
    <Header />
    <div className='col-lg-12'>
      {children}
    </div>
  </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
