module.exports = {
    NODE_ENV: '"development"',
    API: {
        BASE_URL: 'https://api.hanfuc.com',  // https://api.hanfuc.com/  http://127.0.0.1:8000
        // BASE_URL: 'http://127.0.0.1:8080',  // https://api.hanfuc.com/  http://127.0.0.1:8000
        UEDITOR_CONTROLLER: 'https://api.hanfuc.com/controller/server/',
        TIMEOUT: 5000,
        WITHCREDENTIALS: false,
        XSRFCOOKIENAME: 'csrftoken',
        XSRFHEADERNAME: 'X-CSRFToken',
        TOKENPREFIX: 'JWT',
        EDITOR_PREFERENCE: (data) => {
            return {
                'https_uedits_hanfuc_com_activity_writingeditor-demo-01-drafts-data': data,
                // 'http_localhost_8080_activity_writingeditor-demo-01-drafts-data': data
            }
        },
    }
}
