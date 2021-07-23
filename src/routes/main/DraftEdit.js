import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Form, Input, InputNumber, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import { DRAFT, ERROR, INFO, LIST, SUCCESS } from '../../constants/AppConfigs'
import { openNotificationWithIcon } from '../../components/Messages'
import ConfirmButton from '../../components/ConfirmButton'
import { hideLoader, showLoader } from '../../appRedux/actions/Progress'
import { coordinateAsString, coordWithResolution } from '../../util/helpers'

const FormItem = Form.Item

const formRef = React.createRef()

const DraftEdit = (props) => {
  const dispatch = useDispatch()
  const loader = useSelector(state => state.progress.loader)
  const chain = useSelector(state => state.chain)
  const {address, contract} = chain
  const {intl, history} = props
  const [coordinate, setCoordinate] = useState({lat: 0, long: 0})

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (position) {
        setCoordinate({
          lat: coordWithResolution(position.coords.latitude),
          long: coordWithResolution(position.coords.longitude)
        })
      })
    } else {
      openNotificationWithIcon(INFO, intl.formatMessage({id: 'alert.locationServiceDisabled'}))
    }
  }, [])

  const setDraft = async (values) => {
    dispatch(showLoader())
    contract.setDraft(
      [...ethers.utils.toUtf8Bytes(values.title)],
      values.timestamp,
      coordinate
    ).then((result) => {
      dispatch(hideLoader())
      openNotificationWithIcon(SUCCESS, intl.formatMessage({id: 'alert.success.issue.provisional'}))
      history.push(`/${DRAFT}/${LIST}`)
    }).catch((error) => {
      dispatch(hideLoader())
      openNotificationWithIcon(ERROR, error.message)
    })
  }

  return (
    <Spin spinning={loader}>
      <Form
        name="draft-form"
        layout={'vertical'}
        initialValues={{timestamp: Math.floor(Date.now() / 1000)}}
        ref={formRef}
        onFinish={setDraft}>
        <FormItem
          name="account"
          label={intl.formatMessage({id: 'account'})}>
          <span className="ant-input gx-mt-1 gx-mb-1">{address}</span>
        </FormItem>
        <FormItem
          name="title"
          label={intl.formatMessage({id: 'title'})}
          rules={[
            {required: true, message: intl.formatMessage({id: 'alert.fieldRequired'})}
          ]}>
          <Input className="gx-mt-1 gx-mb-1" allowClear/>
        </FormItem>
        <FormItem
          name="timestamp"
          label={intl.formatMessage({id: 'timestamp'})}>
          <InputNumber
            className="gx-mt-1 gx-mb-1 gx-minw200"
            min={1}
            max={253402300799}
            precision={0}/>
        </FormItem>
        <FormItem
          name="coordinate"
          label={intl.formatMessage({id: 'coordinate'})}>
          <span className="ant-input gx-mt-1 gx-mb-1">{coordinateAsString(coordinate || {})}</span>
        </FormItem>
      </Form>
      <ConfirmButton intl={intl} form={formRef} btnTitle={'issue.provisional'} confirmEnabled={false}/>
    </Spin>
  )
}

export default withRouter(injectIntl(DraftEdit))
