function useLocale () {
  // this is the best way to get the current locale for the browser see https://stackoverflow.com/a/57529410
  const locale = Intl.NumberFormat().resolvedOptions().locale

  return { locale }
}

export default useLocale
