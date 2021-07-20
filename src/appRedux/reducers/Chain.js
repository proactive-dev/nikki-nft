import { SET_CONTRACT, SET_IPFS } from '../../constants/ActionTypes'

const INIT_STATE = {
  ipfs: null,
  contract: null,
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
      const {contract, address} = action.payload
      return {
        ...state,
        address,
        contract
      }
    default:
      return state
  }
}
