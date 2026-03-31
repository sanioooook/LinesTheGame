import {onCLS, onFCP, onINP, onLCP, onTTFB, type MetricType} from 'web-vitals';

type ReportFn = (metric: MetricType) => void;

const reportWebVitals = (onPerfEntry?: ReportFn) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
