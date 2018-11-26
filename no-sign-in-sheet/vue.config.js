// vue.config.js
module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/~waltojac/noSignInSheet/no-sign-in-sheet/dist/'
        : '/'
}
