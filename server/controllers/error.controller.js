const sendErrorDevelopment = (err, res) => { 
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

const sendErrorProduction = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'Something went wrong'
    });
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if(process.env.NODE_ENV === 'dev'){
        return sendErrorDevelopment(err, res);
    } else{
        return sendErrorProduction(err, res);
    }
};

module.exports = globalErrorHandler;