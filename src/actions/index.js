import axios from 'axios';

export const FETCH_DATAFLOW = 'FETCH_DATAFLOW';
export const FETCH_PRIORITY = 'FETCH_PRIORITY';
export const FETCH_METRIC_BY_PRIORITY = 'FETCH_METRIC_BY_PRIORITY';

const URL = 'http://localhost:56868/api';

export function fetchPriority() {
    const request = axios.get(`${URL}/EndMetricPriority`);
    return {
        type: FETCH_PRIORITY,
        payload: request
    }
}

export function fetchDataFlow() {
    const request = axios.get(`${URL}/EndMetricDataFlow`);
    return {
        type: FETCH_DATAFLOW,
        payload: request
    }
}

export function fetchEndMetricWithPriority(priority) {
    const request = axios.get(`${URL}/EndMetricDataFlow/${priority}`);
    return {
        type: FETCH_METRIC_BY_PRIORITY,
        payload: request
    }
}