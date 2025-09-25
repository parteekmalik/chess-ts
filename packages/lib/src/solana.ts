import { clsx } from 'clsx'
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const randomSafeMath = (): number => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}