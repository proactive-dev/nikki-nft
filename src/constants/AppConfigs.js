import { ethers } from 'ethers'

export const COPYRIGHT_COMPANY = 'Xyon. All Rights Reserved.'
export const PROJECT_NAME = 'Nikki NFT'
export const STORAGE_KEY = 'nkkcre127'

export const LANGUAGES = [
  {
    code: 'ja',
    name: '日本語'
  }
]

// Notification constants
export const SUCCESS = 'success'
export const ERROR = 'error'
export const INFO = 'info'

export const COMMON_DATE_FORMAT = 'YYYY/MM/DD'
export const COORDINATE_RESOLUTION = 1000000000000000;
export const DEFAULT_PRECISION = 2
export const DEFAULT_DECIMALS = 18

export const RPC_PROVIDER = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_RPC_PROVIDER : process.env.REACT_APP_RPC_PROVIDER_LOCAL
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS

export const HOME = 'home'
export const EDIT = 'edit'
export const VIEW = 'view'
export const LIST = 'list'
export const CERTIFICATE = 'certificate'
export const DRAFT = 'draft'
export const RESULT = 'result'

export const MENUS = [
  {
    path: `${CERTIFICATE}/${EDIT}`,
    title: 'issue.certificate'
  },
  {
    path: `${DRAFT}/${EDIT}`,
    title: 'issue.certificate'
  },
  {
    path: `${DRAFT}/${LIST}`,
    title: 'issue.certificate'
  },
  {
    path: `${CERTIFICATE}/${LIST}`,
    title: 'view.my.cert'
  }
]

export const ISSUE_FEE = ethers.utils.parseEther('10')
