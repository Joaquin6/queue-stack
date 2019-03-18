export default function addConfigToRequest(config) {
  return (req, _, next) => {
    req.config = config;
    return next();
  };
}
