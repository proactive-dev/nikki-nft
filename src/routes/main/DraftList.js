import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, List, Spin } from 'antd'
import { hideLoader, showLoader } from '../../appRedux/actions/Progress'
import { openNotificationWithIcon } from '../../components/Messages'
import { CERTIFICATE, EDIT, ERROR } from '../../constants/AppConfigs'
import { bigNumberArrayToString } from '../../util/helpers'

const DraftList = (props) => {
  const dispatch = useDispatch()
  const loader = useSelector(state => state.progress.loader)
  const chain = useSelector(state => state.chain)
  const {intl, history} = props
  const {contract} = chain
  const [drafts, setDrafts] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    dispatch(showLoader())
    contract.getDrafts().then((result) => {
      dispatch(hideLoader())
      let _drafts = []
      console.log(result)
      result[0].forEach((id, index) => {
        if (result[1][index]['issuedAt'].eq(0)) {
          _drafts.push({
            id: id.toNumber(),
            title: bigNumberArrayToString(result[1][index]['title']),
            timestamp: result[1][index]['timestamp'].toNumber(),
            coordinate: {
              lat: result[1][index]['location']['lat'].toNumber(),
              long: result[1][index]['location']['long'].toNumber()
            }
          })
        }
      })
      setDrafts(_drafts)
    }).catch((error) => {
      dispatch(hideLoader())
      openNotificationWithIcon(ERROR, error.message)
    })
  }

  const goIssue = (info) => {
    history.push({
      pathname: `/${CERTIFICATE}/${EDIT}`,
      state: {info: info}
    })
  }

  return (
    <Spin spinning={loader}>
      <List
        bordered
        header={<div>{drafts.length} {intl.formatMessage({id: 'draft'})}</div>}
        dataSource={drafts}
        renderItem={item =>
          <List.Item key={item.id}>
            <List.Item.Meta
              title={item.title}
            />
            <Button className="gx-link gx-text-underline gx-mb-0" type="link" onClick={() => goIssue(item)}>
              <FormattedMessage id="issue"/>
            </Button>
          </List.Item>
        }
      />
    </Spin>
  )
}

export default withRouter(injectIntl(DraftList))
