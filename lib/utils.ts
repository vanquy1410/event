import { type ClassValue, clsx } from 'clsx'

import { twMerge } from 'tailwind-merge'
import qs from 'query-string'

import { UrlQueryParams, RemoveUrlQueryParams } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateTime = (dateString: Date | undefined) => {
  if (!dateString) {
    return {
      dateTime: '',
      dateOnly: '',
      timeOnly: '',
    };
  }

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }

  const formattedDateTime: string = new Date(dateString).toLocaleString('vi-VN', dateTimeOptions)

  const formattedDate: string = new Date(dateString).toLocaleString('vi-VN', dateOptions)

  const formattedTime: string = new Date(dateString).toLocaleString('vi-VN', timeOptions)

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

  return formattedPrice
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    return {
      error: error.message
    };
  }

  if (typeof error === 'string') {
    console.error(error);
    return {
      error: error
    };
  }

  console.error('Lỗi không xác định:', error);
  return {
    error: 'Đã xảy ra lỗi không xác định'
  };
};

export const formatDateTimeCustom = (dateString: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleString('vi-VN', options)
}

export const formatDateTimeOrDefault = (dateString: Date | undefined, defaultValue: string = 'Chưa có ngày') => {
  if (!dateString) {
    return defaultValue;
  }
  return formatDateTime(dateString).dateTime;
}
