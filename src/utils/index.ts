import { Address } from 'everscale-inpage-provider'

export * from '@/utils/console'
export * from '@/utils/debounce'
export * from '@/utils/storage'
export * from '@/utils/formatted-amount'
export * from '@/utils/slice-address'
export * from '@/utils/throw-exeption'
export * from '@/utils/resolve-everscale-address'
export * from '@/utils/lazyImport'
export * from '@/utils/string-helper'
export * from '@/utils/environment'

export const zeroAddress = new Address(
    '0:0000000000000000000000000000000000000000000000000000000000000000',
)
export const isValidAddress = (address: string): boolean => /^(?:-1|0):[0-9a-fA-F]{64}$/.test(address)
