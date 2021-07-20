import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Form, Input, InputNumber, Spin, Upload } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import _ from 'lodash'
import { ERROR, INFO, SUCCESS } from '../../constants/AppConfigs'
import { openNotificationWithIcon } from '../../components/Messages'
import ConfirmButton from '../../components/ConfirmButton'
import { hideLoader, showLoader } from '../../appRedux/actions/Progress'
import { coordinateAsString, coordWithResolution, uploadIPFS } from '../../util/helpers'

const FormItem = Form.Item

const formRef = React.createRef()

const CertEdit = (props) => {
  const dispatch = useDispatch()
  const loader = useSelector(state => state.progress.loader)
  const chain = useSelector(state => state.chain)
  const {address, contract, ipfs} = chain
  const {intl, history, location} = props
  const [coordinate, setCoordinate] = useState({lat: 0, long: 0})

  useEffect(() => {
    if (!_.isEmpty(location.state) && !_.isEmpty(location.state.info)) {
      const info = location.state.info
      if (info && info.coordinate) {
        setCoordinate(info.coordinate)
      }
      formRef.current.setFieldsValue(info)
    } else {
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
    }
  }, [])

  const mintFromScratch = async (values) => {
    dispatch(showLoader())
    const photoHash = await uploadIPFS({ipfs, file: values.images[0]})
    if (photoHash) {
      contract.mintFromScratch(
        [...ethers.utils.toUtf8Bytes(values.title)],
        values.timestamp,
        coordinate,
        [...ethers.utils.toUtf8Bytes(values.description)],
        photoHash,
        [...ethers.utils.toUtf8Bytes(values.hashtag)]
      ).then((result) => {
        dispatch(hideLoader())
        openNotificationWithIcon(SUCCESS, intl.formatMessage({id: 'alert.success.mint'}))
        history.push('/') // TODO
      }).catch((error) => {
        dispatch(hideLoader())
        openNotificationWithIcon(ERROR, error.message)
      })
    } else {
      dispatch(hideLoader())
      openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.fail2UploadIPFS'}))
    }
  }

  const normalizeFile = (e) => {
    if (e && e.file) {
      return [e.file]
    }
    if (e && e.fileList) {
      if (e.fileList.length > 1) {
        return e.fileList.shift()
      } else {
        return e.fileList[0]
      }
    }
    return []
  }

  return (
    <Spin spinning={loader}>
      <Form
        name="cert-form"
        layout={'vertical'}
        initialValues={{timestamp: Math.floor(Date.now() / 1000)}}
        ref={formRef}
        onFinish={mintFromScratch}>
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
        <FormItem
          name="description"
          label={intl.formatMessage({id: 'description'})}
          rules={[
            {required: true, message: intl.formatMessage({id: 'alert.fieldRequired'})}
          ]}>
          <Input className="gx-mt-1 gx-mb-1" allowClear/>
        </FormItem>
        <FormItem
          name="hashtag"
          label={intl.formatMessage({id: 'hashtag'})}
          rules={[
            {required: true, message: intl.formatMessage({id: 'alert.fieldRequired'})}
          ]}>
          <Input className="gx-mt-1 gx-mb-1" allowClear/>
        </FormItem>
        <FormItem
          name="images"
          label={intl.formatMessage({id: 'image'})}
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
          rules={[
            {required: true, message: intl.formatMessage({id: 'alert.fieldRequired'})}
          ]}>
          <Upload.Dragger
            beforeUpload={() => {
              return false
            }}
            listType={'picture'}
            maxCount={1}>
            <p className="ant-upload-drag-icon">
              <PictureOutlined/>
            </p>
            <p className="ant-upload-text"><FormattedMessage id={'upload.image.text'}/></p>
            <p className="ant-upload-hint"><FormattedMessage id={'upload.image.hint'}/></p>
          </Upload.Dragger>
        </FormItem>
      </Form>
      <ConfirmButton intl={intl} form={formRef} btnTitle={'request'} confirmEnabled={false}/>
    </Spin>
  )
}

export default withRouter(injectIntl(CertEdit))
