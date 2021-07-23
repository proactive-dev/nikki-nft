import { SET_CONTRACT, SET_IPFS } from '../../constants/ActionTypes'

const INIT_STATE = {
  ipfs: null,
  contract: null,
  signer: null,
  address: null
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_IPFS:
      return {
        ...state,
        ipfs: action.payload
      }
    case SET_CONTRACT:
      const {contract, signer, address} = action.payload
      return {
        ...state,
        signer,
        address,
        contract
      }
    default:
      return state
  }
}
