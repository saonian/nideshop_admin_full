<template>
  <div style="height: 100%;">
    <canvas id="canvas"></canvas>
    <div class="logcontainer">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
      label-width="0px"
      class="card-box login-form">
      <h1 class="title">元气小店</h1>
      <!-- <div class="logo"><img src="../../assets/images/logo.png" width="100%" /></div> -->
      <el-form-item prop="username">
        <el-input name="username" v-model="loginForm.username" placeholder="登录账号" prefix-icon="el-icon-fa-user" auto-complete="on"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" type="password" @keyup.enter.native="handleLogin"
        v-model="loginForm.password" placeholder="密码" prefix-icon="el-icon-fa-key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%;background-color: #00acc8;border-color: #00acc8;color: #fff"
        :loading="loading" @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form-item>
    <p style="text-align: center;">
      <small>元气小店 © 2018</small>
    </p>
    <!--<router-link to="/sendpwd" class="forget-pwd">-->
      <!--忘记密码?-->
      <!--</router-link>-->
    </el-form>
  </div>

</div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入登录账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入登录密码' }
        ]
      },
      loading: false
    }
  },
  computed: {
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({path: '/home'})
          }).catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  },
  mounted () {
    // 参考资料：https://github.com/sunshine940326/canvas-nest
    class Circle {
      // 创建对象
      // 以一个圆为对象
      // 设置随机的 x，y坐标，r半径，_mx，_my移动的距离
      // this.r是创建圆的半径，参数越大半径越大
      // this._mx,this._my是移动的距离，参数越大移动
      constructor (x, y) {
        this.x = x
        this.y = y
        this.r = Math.random() * 10
        this._mx = Math.random()
        this._my = Math.random()
      }

      // canvas 画圆和画直线
      // 画圆就是正常的用canvas画一个圆
      // 画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
      drawCircle (ctx) {
        ctx.beginPath()
        // arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
        ctx.arc(this.x, this.y, this.r, 0, 360)
        ctx.closePath()
        // ctx.fillStyle = 'rgba(204, 204, 204, 0.3)';
        ctx.fillStyle = 'rgba(0,172,200,0.2)'
        ctx.fill()
      }

      drawLine (ctx, _circle) {
        let dx = this.x - _circle.x
        let dy = this.y - _circle.y
        let d = Math.sqrt(dx * dx + dy * dy)
        if (d < 150) {
          ctx.beginPath()
          // 开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
          ctx.moveTo(this.x, this.y) // 起始点
          ctx.lineTo(_circle.x, _circle.y) // 终点
          ctx.closePath()
          ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)'
          ctx.stroke()
        }
      }

      // 圆圈移动
      // 圆圈移动的距离必须在屏幕范围内
      move (w, h) {
        this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx)
        this._my = (this.y < h && this.y > 0) ? this._my : (-this._my)
        this.x += this._mx / 2
        this.y += this._my / 2
      }
    }
    // 鼠标点画圆闪烁变动
    class CurrentCirle extends Circle {
      drawCircle (ctx) {
        ctx.beginPath()
        // 注释内容为鼠标焦点的地方圆圈半径变化
        // this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
        this.r = 8
        ctx.arc(this.x, this.y, this.r, 0, 360)
        ctx.closePath()
        // ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')'
        ctx.fillStyle = 'rgba(255, 77, 54, 0.6)'
        ctx.fill()
      }
    }
    // 更新页面用requestAnimationFrame替代setTimeout
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    let w = canvas.width = canvas.offsetWidth
    let h = canvas.height = canvas.offsetHeight
    let circles = []
    let currentCir = new CurrentCirle(0, 0)
    let draw = function () {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < circles.length; i++) {
        circles[i].move(w, h)
        circles[i].drawCircle(ctx)
        for (let j = i + 1; j < circles.length; j++) {
          circles[i].drawLine(ctx, circles[j])
        }
      }
      if (currentCir.x) {
        currentCir.drawCircle(ctx)
        for (var k = 1; k < circles.length; k++) {
          currentCir.drawLine(ctx, circles[k])
        }
      }
      requestAnimationFrame(draw)
    }
    let init = function (num) {
      for (var i = 0; i < num; i++) {
        circles.push(new Circle(Math.random() * w, Math.random() * h))
      }
      draw()
    }
    window.addEventListener('load', init(80))
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 5px;
}

.logcontainer {
  top: 100%;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #ddd inset !important;
    -webkit-text-fill-color: #00acc8 !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: #00acc8;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
  }

  .title {
    font-size: 70px;
    font-weight: 600;
    color: #00acc8;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .logo {

  }

  .login-form {
    position: absolute;
    /*left: 0;*/
    /*right: 0;*/
    /*width: 400px;*/
    /*padding: 35px 35px 15px 35px;*/
    /*margin: 120px auto 0;*/
    top: 150px;

    left: 50%;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin-left: -200px;
  }

  .el-form-item {
    /*border: 1px solid #ddd;*/
    background: #eae9e9;
    border-radius: 5px;
  }

  .forget-pwd {
    color: #fff;
  }
}

canvas {
  display: block;
  width: 100%;
  height: 100vh;
}

</style>
