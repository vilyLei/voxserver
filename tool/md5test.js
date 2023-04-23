const fs = require('fs');
const crypto = require('crypto');

const filePath = '../bin/static/voxweb3d/demos/followParticleShooter.js';

fs.readFile(filePath, (err, data) => {
  if (err) throw err;

//   data = "NTCTT4Q887=K2z4E^E7u$YKYutE_zwgptHppYGGFwF_FqbH6b3FUNTCTT7Q=88=$274K^^7p$YKtuYE_ztgYtbpYYYGGw__9qbHbb6FFD9";
  const hash = crypto.createHash('md5');
  hash.update(data);
  const md5 = hash.digest('hex');

  console.log(`The MD5 of ${filePath} is:\n ${md5}`);
});
