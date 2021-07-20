import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Card, Col, Row } from 'antd'
import { withRouter } from 'react-router-dom'
import { MENUS } from '../../constants/AppConfigs'

const Home = (props) => {
  const {history} = props

  const onClick = (path) => {
    history.push(`/${path}`)
  }

  return (
    <Row className="gx-pt-5 gx-pb-5">
      {
        MENUS.map(({path, title}) =>
          <Col span={12} xxl={8} xl={8} lg={8} md={12} sm={12} xs={12} key={path}>
            <Card className="gx-card-home"
                  bordered={false}
                  onClick={() => onClick(path)}>
              <FormattedMessage id={title}/>
            </Card>
          </Col>
        )
      }
    </Row>
  )
}

export default withRouter(Home)
