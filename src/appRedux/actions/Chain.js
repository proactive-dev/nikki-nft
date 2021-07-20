import { SET_CONTRACT, SET_IPFS } from '../../constants/ActionTypes'

export function setIPFS(ipfs) {
  return {
    type: SET_IPFS,
    payload: ipfs
  }
}

export function setContract(data) {
  return {
    type: SET_CONTRACT,
    payload: data
  }
}
