import React, { Fragment, useEffect, useState } from 'react'
import { Alert, Button, Col, Layout, Modal, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { isMobile } from 'react-device-detect'
import { ethers } from 'ethers'
import _ from 'lodash'
import {
  CONTRACT_ADDRESS,
  COPYRIGHT_COMPANY,
  ERROR,
  RPC_PROVIDER,
  STORAGE_KEY
} from '../../constants/AppConfigs'
import { NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE } from '../../constants/ThemeSetting'
import { decrypt, encrypt } from '../../util/crypto'
import NikkiNFT from '../../artifacts/contracts/NikkiNFT.sol/NikkiNFT.json'
import Sidebar from '../Sidebar/index'
import TopBar from '../../components/TopBar'
import { openNotificationWithIcon } from '../../components/Messages'
import MetaMaskButton from '../../components/MetaMaskButton'
import WalletCreateModal from '../../components/WalletCreateModal'
import WalletRestoreModal from '../../components/WalletRestoreModal'
import { setContract, setIPFS } from '../../appRedux/actions/Chain'
import MainRoute from './MainRoute'
import TermsModal from '../../components/TermsModal'

const {Content, Footer} = Layout
const {confirm} = Modal

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

const MainApp = (props) => {
  const {intl} = props
  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings)
  const {navStyle, width} = settings
  const [connected, setConnected] = useState(false)
  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [visibleRestoreModal, setVisibleRestoreModal] = useState(false)
  const [visibleTermsModal, setVisibleTermsModal] = useState(false)

  useEffect(() => {
    checkSavedInfo()
    dispatch(setIPFS(ipfs))
  }, [])

  const checkSavedInfo = () => {
    try {
      const savedKey = JSON.parse(decrypt(localStorage.getItem(STORAGE_KEY)))
      if (savedKey) {
        confirm({
          title: intl.formatMessage({id: 'load.account'}),
          content: intl.formatMessage({id: 'confirm.load.description'}),
          okText: intl.formatMessage({id: 'load'}),
          onOk: () => {
            setWallet(new ethers.Wallet(savedKey))
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectMetaMask = async () => {
    if (window.ethereum) { // Modern dapp browsers...
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        await window.ethereum.enable()
        setWallet(provider.getSigner())
      } catch (error) {
        openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.fail2ConnectAccount'}))
        console.log(error)
      }
    } else if (window.web3) { // Legacy dapp browsers...
      console.log('Injected web3 detected.')
    }
  }

  const setWallet = async (wallet) => {
    // Setup contract
    const provider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NikkiNFT.abi, wallet.connect(provider))
    // Get user address
    const address = await wallet.getAddress()

    dispatch(setContract({contract, address}))
    setConnected(true)
  }

  const onCreate = (data) => {
    setVisibleCreateModal(false)
    showConfirmSaveInfo(data)
  }

  const onRestore = (data) => {
    setVisibleRestoreModal(false)
    showConfirmSaveInfo(data)
  }

  const onAgreeTerms = () => {
    setVisibleTermsModal(false)
    setVisibleCreateModal(true)
  }

  const showConfirmSaveInfo = (data) => {
    confirm({
      title: intl.formatMessage({id: 'save.account'}),
      content: intl.formatMessage({id: 'confirm.save.description'}),
      okText: intl.formatMessage({id: 'save'}),
      onOk: () => {
        localStorage.setItem(STORAGE_KEY, encrypt(JSON.stringify(data.privateKey)))
        setWallet(data)
      },
      onCancel: () => {
        setWallet(data)
      }
    })
  }

  const getSidebar = () => {
    if (width < TAB_SIZE) {
      return <Sidebar/>
    }
    switch (navStyle) {
      case NAV_STYLE_FIXED :
        return <Sidebar/>
      case NAV_STYLE_DRAWER :
        return <Sidebar/>
      case NAV_STYLE_MINI_SIDEBAR :
        return <Sidebar/>
      default :
        return null
    }
  }

  return (
    <Layout className="gx-app-layout">
      {getSidebar()}
      <Layout>
        <TopBar/>
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper">
            {
              connected ?
                <MainRoute/>
                :
                <Fragment>
                  <Alert message={intl.formatMessage({id: 'alert.connectAccount'})} type="warning" showIcon/>
                  <Row className="gx-m-3 gx-p-2">
                    {
                      !isMobile &&
                      <Col span={8} xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                        <MetaMaskButton onClick={connectMetaMask}/>
                      </Col>
                    }
                    <Col span={8} xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                      <Button className="login-form-button" size="large" type="primary"
                              onClick={() => setVisibleTermsModal(true)}>
                        <FormattedMessage id="create"/>
                      </Button>
                    </Col>
                    <Col span={8} xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                      <Button className="login-form-button" size="large" type="secondary"
                              onClick={() => setVisibleRestoreModal(true)}>
                        <FormattedMessage id="import.or.restore"/>
                      </Button>
                    </Col>
                  </Row>
                  {
                    visibleCreateModal &&
                    <WalletCreateModal
                      intl={intl}
                      onOk={onCreate}
                      onCancel={() => setVisibleCreateModal(false)}/>
                  }
                  {
                    visibleRestoreModal &&
                    <WalletRestoreModal
                      intl={intl}
                      onOk={onRestore}
                      onCancel={() => setVisibleRestoreModal(false)}/>
                  }
                  {
                    visibleTermsModal &&
                    <TermsModal
                      intl={intl}
                      onOk={onAgreeTerms}
                      onCancel={() => setVisibleTermsModal(false)}/>
                  }
                </Fragment>
            }
          </div>
          <Footer>
            <div className="gx-layout-footer-content">
              © {new Date().getFullYear()} {COPYRIGHT_COMPANY}
            </div>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  )
}

export default injectIntl(MainApp)
