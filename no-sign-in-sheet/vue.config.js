// vue.config.js
/// '/~sullivlo/noSignInSheet/no-sign-in-sheet/dist/'
module.exports = {
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/~waltojac/noSignInSheet/no-sign-in-sheet/dist/'
        : '/'
}
