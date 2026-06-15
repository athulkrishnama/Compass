import prom_bundle from "express-prom-bundle";
export function promotheusMiddlware() {
  const metric_middleware = prom_bundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
  });
  return metric_middleware;
}
