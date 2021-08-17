import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, Popover, Typography } from 'antd'
import { FormattedMessage } from 'react-intl'
import { WalletOutlined } from '@ant-design/icons'
import { ethers } from 'ethers'

const {Paragraph, Text} = Typography

const AccountInfo = (props) => {
  const {connected, connect, disconnect} = props
  const loader = useSelector(state => state.progress.loader)
  const chain = useSelector(state => state.chain)
  const {signer, address} = chain
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    async function fetchBalance() {
      setBalance(signer ? (await signer.getBalance()) : 0)
    }

    fetchBalance()
  }, [signer])

  const menus = (
    <ul className="gx-sub-popover">
      <li className="gx-pointer">
        <Paragraph copyable>{address}</Paragraph>
        <Text strong>{ethers.utils.formatEther(balance)} ETH</Text>
      </li>
      <li onClick={disconnect}>
        <FormattedMessage id="disconnect"/>
      </li>
    </ul>
  )

  return (
    <>
      {
        connected ?
          <Popover
            overlayClassName="gx-popover-horizantal"
            placement="bottomRight"
            content={menus}
            trigger="click">
            <Avatar icon={<WalletOutlined/>} className="gx-pointer" alt=""/>
          </Popover>
          :
          <Button
            className="login-form-button gx-m-0" size="large" type="primary"
            loading={loader}
            onClick={connect}>
            <FormattedMessage id="connect"/>
          </Button>
      }
    </>
  )

}

export default AccountInfo
