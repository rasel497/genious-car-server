function verifyJWT(req, res, next) {
    // console.log(req.headers.authorization);
    const authHeader = req.headers.authoriztion;
    if (!authHeader) {
        res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}