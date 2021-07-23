import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Result } from 'antd'
import { Link, withRouter } from 'react-router-dom'

const MintResult = (props) => {
  const {intl} = props

  return (
    <Result
      status="success"
      title={intl.formatMessage({id: 'alert.success.mint'})}
      extra={[
        <Link className="gx-btn gx-btn-primary" to="/"><FormattedMessage id="go.home"/></Link>
      ]}
    />
  )
}

export default withRouter(injectIntl(MintResult))
