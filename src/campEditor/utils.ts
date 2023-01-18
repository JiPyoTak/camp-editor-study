function isSizeAttribute(arg: string | number) {
  const reg = /([0-9])+(px|rem|em|%|vw|vh)$/;
  return reg.test(String(arg));
}

function isNumber(arg: string | number) {
  return !isNaN(Number(arg));
}

export { isSizeAttribute, isNumber };
