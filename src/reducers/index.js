import { combineReducers } from 'redux';
import DataFlowReducer from './reducer_dataflow';

const rootReducer = combineReducers({
    dataflowInfos: DataFlowReducer
});

export default rootReducer;