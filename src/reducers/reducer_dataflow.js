import { FETCH_DATAFLOW } from '../actions/index';

const INITIAL_STATE = { all: {} };

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case FETCH_DATAFLOW: 
            console.log(action.payload.data);
            return { all: action.payload.data };
        default: return state;
    }
}