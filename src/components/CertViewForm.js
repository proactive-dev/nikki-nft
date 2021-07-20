import React from 'react'
import { Form, Image } from 'antd'
import { coordinateAsString, ipfsLink } from '../util/helpers'

const FormItem = Form.Item

const CertViewForm = (props) => {
  const {intl, account, cert} = props
  const {title, timestamp, coordinate, description, hashtag, issuedAt, fileHash} = cert

  return (
    <Form
      name="cert-view-form"
      layout={'vertical'}>
      <FormItem name="account" label={intl.formatMessage({id: 'account'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{account || ''}</span>
      </FormItem>
      <FormItem name="title" label={intl.formatMessage({id: 'title'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{title || ''}</span>
      </FormItem>
      <FormItem name="timestamp" label={intl.formatMessage({id: 'timestamp'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{timestamp || ''}</span>
      </FormItem>
      <FormItem name="coordinate" label={intl.formatMessage({id: 'coordinate'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{coordinateAsString(coordinate || {})}</span>
      </FormItem>
      <FormItem name="description" label={intl.formatMessage({id: 'description'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{description || ''}</span>
      </FormItem>
      <FormItem name="hashtag" label={intl.formatMessage({id: 'hashtag'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{hashtag || ''}</span>
      </FormItem>
      <FormItem name="file" label={intl.formatMessage({id: 'image'})}>
        <Image className="gx-mt-1 gx-mb-1" src={ipfsLink(fileHash)} alt={intl.formatMessage({id: 'image'})}/>
      </FormItem>
      <FormItem name="issuedAt" label={intl.formatMessage({id: 'issuedAt'})}>
        <span className="ant-input gx-mt-1 gx-mb-1">{issuedAt || ''}</span>
      </FormItem>
    </Form>
  )
}

export default CertViewForm
