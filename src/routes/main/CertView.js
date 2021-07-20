import React, { useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { openNotificationWithIcon } from '../../components/Messages'
import { ERROR } from '../../constants/AppConfigs'
import { bigNumberArrayToString, timestamp2Date } from '../../util/helpers'
import { hideLoader, showLoader } from '../../appRedux/actions/Progress'
import CertViewForm from '../../components/CertViewForm'

const CertView = (props) => {
  const dispatch = useDispatch()
  const loader = useSelector(state => state.progress.loader)
  const chain = useSelector(state => state.chain)
  const {intl, match, history} = props
  const {address, contract} = chain
  const [id, setId] = useState(null)
  const [cert, setCert] = useState({})

  useEffect(() => {
    let id = match.params.id
    if (!_.isEmpty(id) && !_.isUndefined(id)) {
      setId(id)
      fetchData(id)
    } else {
      openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.invalidData'}))
    }
  }, [])

  const fetchData = (id) => {
    dispatch(showLoader())
    contract.getCertificate(id).then((result) => {
      dispatch(hideLoader())
      console.log(result)
      if (_.isEmpty(result)) {
        openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.emptyData'}))
        window.history.back()
      } else {
        const _cert = {
          title: bigNumberArrayToString(result['title']),
          timestamp: result['timestamp'].toNumber(),
          coordinate: {
            lat: result['location']['lat'].toNumber(),
            long: result['location']['long'].toNumber()
          },
          description: bigNumberArrayToString(result['description']),
          fileHash: result['fileHash'],
          hashtag: bigNumberArrayToString(result['hashtag']),
          issuedAt: timestamp2Date(result['issuedAt'].toNumber())
        }
        if (_.isEmpty(_cert['title']) || _.isEmpty(_cert['description']) || _.isEmpty(_cert['fileHash']) || _.isEmpty(_cert['hashtag'])) {
          openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.emptyData'}))
          window.history.back()
        } else {
          setCert(_cert)
        }
      }
    }).catch((error) => {
      dispatch(hideLoader())
      openNotificationWithIcon(ERROR, error.message)
      window.history.back()
    })
  }

  return (
    <Spin spinning={loader}>
      <CertViewForm
        intl={intl}
        account={address}
        cert={cert}
      />
    </Spin>
  )
}

export default withRouter(injectIntl(CertView))
