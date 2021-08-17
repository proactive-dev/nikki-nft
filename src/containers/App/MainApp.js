import React, { Fragment, useEffect, useState } from 'react'
import { Alert, Layout } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { injectIntl } from 'react-intl'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Torus from '@toruslabs/torus-embed'
import { CONTRACT_ADDRESS, COPYRIGHT_COMPANY, ERROR, INFO, RPC_PROVIDER } from '../../constants/AppConfigs'
import { NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE } from '../../constants/ThemeSetting'
import NikkiNFT from '../../artifacts/contracts/NikkiNFT.sol/NikkiNFT.json'
import Sidebar from '../Sidebar/index'
import TopBar from '../../components/TopBar'
import { setContract, setIPFS } from '../../appRedux/actions/Chain'
import MainRoute from './MainRoute'
import { openNotificationWithIcon } from '../../components/Messages'
import { isValidChain } from '../../util/helpers'

const {Content, Footer} = Layout

const providerOptions = {
  torus: {
    package: Torus,
    options: {
      networkParams: {
        host: RPC_PROVIDER
      }
    }
  }
}

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

let web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions
  })
}

const MainApp = (props) => {
  const {intl} = props
  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings)
  const {navStyle, width} = settings
  const [connected, setConnected] = useState(false)
  const [web3Provider, setWeb3Provider] = useState()

  const connect = async () => {
    web3Modal.clearCachedProvider()
    const provider = await web3Modal.connect()
    const web3Provider = new ethers.providers.Web3Provider(provider)
    const network = await web3Provider.getNetwork()
    if (!isValidChain(network.chainId)) {
      openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.chain.invalid'}))
      disconnect()
      return
    }

    const signer = web3Provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, NikkiNFT.abi, signer)
    const address = await signer.getAddress()
    dispatch(setContract({contract, signer, address}))
    setWeb3Provider(web3Provider)
    setConnected(true)
  }

  const disconnect = async () => {
    await web3Modal.clearCachedProvider()
    if (web3Provider?.disconnect && typeof web3Provider.disconnect === 'function') {
      await web3Provider.disconnect()
    }
    dispatch(setContract({contract: null, signer: null, address: null}))
    setConnected(false)
  }

  useEffect(() => {
    dispatch(setIPFS(ipfs))

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.account.changed'}))
        disconnect()
      })

      window.ethereum.on('chainChanged', function (netId) {
        if (isValidChain(parseInt(netId))) {
          openNotificationWithIcon(INFO, intl.formatMessage({id: 'alert.chain.changed'}))
        } else {
          openNotificationWithIcon(ERROR, intl.formatMessage({id: 'alert.chain.invalid'}))
          disconnect()
        }
      })
    }
  }, [])

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
        <TopBar
          connected={connected}
          connect={connect}
          disconnect={disconnect}
        />
        <Content className="gx-layout-content gx-container-wrap">
          <div className="gx-main-content-wrapper">
            {
              (web3Provider && connected) ?
                <MainRoute/>
                :
                <Fragment>
                  <Alert message={intl.formatMessage({id: 'alert.connectAccount'})} type="warning" showIcon/>
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
