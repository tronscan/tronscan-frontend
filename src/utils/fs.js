import fs from 'fs';

/**
 * 读取文件
 * @param file 文件
 */
export const readFile = file => {
    return new Promise((resolve, reject) => {
        console.log(fs, '===')
        fs.readFile(
            file,
            'utf8',
            (err, data) => (err ? reject(err) : resolve(data)),
        );
    });
};
