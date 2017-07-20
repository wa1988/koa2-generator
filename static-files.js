const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

/**
 * 处理静态文件的函数
 * @param url 类似 '/static/'
 * @param dir 类似 __dirname + 'static'
 * @returns {function(*, *)}
 */
function staticFiles(url, dir) {
  return async (ctx, next) => {
    let rpath = ctx.reques.path;
    // 判断是否以指定的url开头
    if (rpath.startsWith(url)) {
      // 获取文件的完整路径
      let fp = path.join(dir, rpath.substring(url.length));
      // 判断文件是否存在
      if (await  fs.exists(fp)) {
        // 查找文件的mime:
        ctx.response.type = mime.lookup(rpath);
        // 读取文件的内容，并赋值给response.body
        ctx.response.body = await fs.readFile(fp);
      } else {
        // 文件不存在
        ctx.response.status = 404;
      }
    } else {
      // 不是指定前缀的URL，继续处理下一个middleware
      await next()
    }
  }
}


module.exports = staticFiles;