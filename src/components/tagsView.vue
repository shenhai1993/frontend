<template>
    <div class="tags navs" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.name}}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <!-- 其他操作按钮 -->
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tagsList: []
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch: {
            // 对router进行监听，每当访问router时，对tags的进行修改
            $route(newValue) {
                this.setTags(newValue);
            }
        },
        created() {
            // 第一次进入页面时，修改tag的值
            this.setTags(this.$route);
        },
        methods: {
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                } else {
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll() {
                this.tagsList = [];
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOther() {
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.path;
                })
                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route) {
                const isExist = this.tagsList.some(item => {
                    return item.path === route.path;
                })
                !isExist && this.tagsList.push({
                    name: route.name,
                    path: route.path,
                   // name: route.matched[1].components.default.name
                })
            },
            // 当关闭所有页面时隐藏
            handleTags(command) {
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        }
    }
</script>


<style>
    .tags.navs {
        position: relative;
        height: 34px;
        border: 0px;
        overflow: hidden;
        background: #eaeff4;
        padding-right: 120px;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        position: relative;
        float: left;
        border-radius: 0px;
        font-size: 14px;
        overflow: hidden;
        cursor: pointer;
        height: 34px;
        line-height: 34px;
        background: #eaeff4;
        padding: 0 15px 0 15px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }
    .tags-li:after{
      content: '';
      position: absolute;
      right: 0px;
      top: 7px;
      width: 1px;
      height: 20px;
      background-color: #aaacb6;

    }
    .tags-li:not(.active):hover {
        background: #ffffff;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active {
        color: #000000;
        border: 1px solid #ffffff;
        background-color: #ffffff;
        border-top-right-radius: 4px;
    }
    .tags-li.active:after{
      height: 0px;
    }
    .tags-li.active .tags-li-title {
        color: #000000;
    }

    .tags-close-box {
        position: fixed;
        right: 15px;
        top: 72px;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        z-index: 10;
    }

</style>
