export const getDefaultHost = () => process.env.NEXT_PUBLIC_HOST_URL || 'localhost:3000'

export const getAbsoluteURL = ({
  path = '',
  host = getDefaultHost()
} = {}) => {
  let baseURL = isLocalhost(host) ? `http://${host}` : `https://${host}`
  return baseURL + path
}

export function printElement<T extends HTMLElement>(el: T) {
  var printContents = el.outerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print()

  document.body.innerHTML = originalContents;

  window.location.reload()
}

export const isLocalhost = (host = getDefaultHost()) => {
  const splitedHost = host.split('.')
  return splitedHost.slice(0, splitedHost.length >= 3 ? splitedHost.length - 1 : splitedHost.length).some(str => str.startsWith('localhost'))
}

const matcher = (regexp: RegExp, fields?: string[]): (obj: Object) => boolean => {
  return (obj) => {
    const fields1 = fields || Object.keys(obj)
    let found = false
    fields1.forEach(key => {
      if (!found) {
        if ((typeof obj[key] == 'string') && regexp.exec(obj[key])) {
          found = true
        }
      }
    })
    return found
  }
}

export function search<T>(collection: T[], test: string | string[], fields?: string[]): T[] {
  let c = []
  if (test == undefined || test == null) {
    return c
  }
  if (typeof test == 'string') {
    const regex = new RegExp("\\b" + test, 'i')
    c = collection.filter(matcher(regex, fields))
  } else {
    let found = []
    test.forEach(t => {
      const regex = new RegExp("\\b" + t + "\\b", 'i')
      found = [...found, ...collection.filter(matcher(regex, fields))]
    })
  }
  return c
}

export const formatDate = (str: string | Date, separator = '/') => {
  const d = new Date(str)
  const padLeft = (n: number) => ('00' + n).slice(-2)
  const dformat = [
    d.getFullYear(),
    padLeft(d.getMonth() + 1),
    padLeft(d.getDate()),
  ].join(separator)
  return dformat
}

export const dateToUTC = (date: Date | string) => {
  return new Date(date).getTime() / 1000 - (new Date(date).getTimezoneOffset() * 60)
}
