const logRequest = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${req.method} ${req.url} - ${timestamp} from ${req.ip}`);
    next();
};
module.exports = logRequest;