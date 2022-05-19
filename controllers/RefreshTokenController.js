const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    //res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    //console.log(foundUser);
    
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || String(foundUser._id) !== decoded._id) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { _id: decoded._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            // const newRefreshToken = jwt.sign(
            //     { _id: foundUser._id },
            //     process.env.REFRESH_TOKEN_SECRET,
            //     { expiresIn: '7d' }
            // );
            //foundUser.refreshToken = newRefreshToken;
            //await foundUser.save();
            //res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }