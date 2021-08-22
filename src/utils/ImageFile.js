export default {
    randomChar(num = 5) {
        let x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
        let tmp = "";
        let timestamp = new Date().getTime();
        for (let i = 0; i < num; i++) {
            tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
        }
        return timestamp + tmp;
    },

    FileImage(dataurl, filename) {
        /**
         * base64 转 图片文件
         */
        if (!filename) filename = this.randomChar() + '.jpeg'
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }


        return new File([u8arr], filename, {
            type: mime
        });
    },
    base64ToFile(base64, filename, flie = 'images') {
        /**
         * 将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
         * @type {string}
         */

        if (!filename) filename = this.randomChar() + '.jpeg'
        let bytes = atob(base64.split(',')[1])
        let ab = new ArrayBuffer(bytes.length)
        let ia = new Uint8Array(ab)
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i)
        }
        let imgs = new File([ab], filename, {type: 'image/jpg'})
        return imgs;
    },
    FileTuBase64(url) {
        /**
         * 调用本方法后在赋值<img src=...> 否则报错
         * Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.
         * 关于javascript：未捕获的DOMException：无法在’FileReader’上执行’readAsDataURL’：该对象已经在忙于读取Blob。
         * @param url
         * @param cb
         */
        const getImageBlob = (url, cb) => {
            const xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    if (cb) cb(this.response);
                }
            };
            xhr.send();
        }

        return new Promise((resolve) => {
            let reader = new FileReader();

            getImageBlob(url, function (blob) {
                reader.readAsDataURL(blob);
            });

            reader.onload = function () {
                resolve({
                    data: String(reader.result)
                })
                // let img = document.createElement("img");
                // img.src = e.target.result;
                // document.body.appendChild(img);
            }

        })

    }
}
