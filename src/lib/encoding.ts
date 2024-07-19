const str2base64 = (str: string) => {
  return Buffer.from(str, 'base64');
}

const str2hex = (str: string) => {
  return Buffer.from(str).toString('hex');
}

const hex2str = (hexStr: string) => {
  return Buffer.from(hexStr, 'hex').toString();
}

export {
  str2base64,
  str2hex,
  hex2str,
};