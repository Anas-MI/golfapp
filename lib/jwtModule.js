const config = require('../config/index');
const fs = require('fs');
const jwt = require('jsonwebtoken');
// const privateKey = fs.readFileSync('./private.key', 'utf8'); // to sign JWT
// const publicKey = fs.readFileSync('./public.key', 'utf8'); // to verify JWT

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCT/RJHpGekMpbGiyNTP2FqcCB32mydAbdh6RTXbbpxLPyyRpjS
NpRgHU32UlDNS6uyDy/8Twh9yIvlipw8NRHiuiI1sHsmKqYy96KCm+s53jbPAmfe
f6BfakR31wUAbkt8p4k3M4dsul8WkCdjFR83sNBfR8jvAKENiFhupc2X4wIDAQAB
AoGAdiE7aEjKGn3vcUk7x4X+YxJiOIn4zVPDaLq/0j9a5mC8ziogbxz2T8rUot2O
dnIC+j25VjRYWN+vHGoK0NykCxefzA8WP9BeJvT5iM4Aseqna4iA5YULmfK66+0R
spZU7WwfIxpf+wM1YUEtWlhj8jCSEsKkaL1bOxibRX8DfKECQQDiuABK2LBU1nIw
XdIR1AxozSU+MSw8L+Wu1uqSc5Cd+kM5+cEAqBAexjc39Nb8a5Yie2i54qRRyTrb
O6lSpEGpAkEApxoD10BDKiMQUnKXi6iunyDgO1bvTjqfTZLi4BESSdr1cSPEzQrt
SzbSzfjOU6XPFTS806VtGG0LQYgBzrVcqwJBAI+wjn7hVuBuCXEeBUXHXxYM7s27
3I1IzglBrOmk1MNLGdBkui3wVkcq2VRdmOPiTAUOshEd04cCQoswBOCbugECQHol
EQOprK7DXK33p4Dlt2cIIAAgJuLXBRUuNnq039punBSsobGDuDrPgz4eDaulOv70
QsauWFWPd7faFAAmH+sCQDBaapjNDlcNrkxpAEPvPv+DH0BwoPkb2P4jjccA3JCB
uF296g4BQW1LtvcBxPDBk6VDry3ReS7YP5Cr4w6ijw0=
-----END RSA PRIVATE KEY-----`
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCT/RJHpGekMpbGiyNTP2FqcCB3
2mydAbdh6RTXbbpxLPyyRpjSNpRgHU32UlDNS6uyDy/8Twh9yIvlipw8NRHiuiI1
sHsmKqYy96KCm+s53jbPAmfef6BfakR31wUAbkt8p4k3M4dsul8WkCdjFR83sNBf
R8jvAKENiFhupc2X4wIDAQAB
-----END PUBLIC KEY-----`

module.exports = {
  sign: (payload, options) => {
    const signingOptions = {
      algorithm: 'RS256',
      audience: options.audience,
      expiresIn: config.jwtExpires,
      issuer: config.jwtIssuer,
      subject: options.subject
    };
    return jwt.sign(payload, privateKey, signingOptions);
  },

  parseTokenFromAuthorizationHeader: (req) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader || !authorizationHeader.includes('Bearer ') ) {
      return null
    }
    return req.headers['authorization'].split(' ')[1]
  },

  verify: (token, options) => {
    const verifyOptions = {
      algorithm: ['RS256'],
      audience: options.audience,
      expiresIn: config.jwtExpires,
      issuer: config.jwtIssuer
    };
    try {
      return jwt.verify(token, publicKey, verifyOptions);
    } catch(err){
      return null;
    }
  },

  decode: (token) => {
    return jwt.decode(token, {complete: true});
  }
}
