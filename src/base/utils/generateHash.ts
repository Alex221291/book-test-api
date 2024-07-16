import md5 from './md5';
import { generateRandomCode } from './generateRandomCode';

const generateHash = () =>
	md5(`${Math.floor(Date.now() / 1000)}.${generateRandomCode()}`).slice(0, 8);

export default generateHash;
