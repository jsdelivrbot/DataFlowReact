import axios from 'axios';

export const FETCH_DATAFLOW = 'FETCH_DATAFLOW';

const URL = 'http://localhost:56868/api/EndMetricDataFlow';

export function fetchDataFlow() {
    const request = axios.get(`${URL}`);
    return {
        type: FETCH_DATAFLOW,
        payload: request
    }
}