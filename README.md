# frontend

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

``` bash
# 拼接屏视频切割命令
/opt/lampp/ffmpeg/bin/ffmpeg -i "%s" -strict -2 -vf crop=%s:%s:%s:%s -c:v h264 -b:v 18M %s "%s"
1、文件路径
2、区域宽
3、区域高
4、区域X
5、区域Y
6、
7、输出文件路径
```