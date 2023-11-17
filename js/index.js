// 单个商品类
class UIGoods {
  constructor(g) {
    this.goods = g
    this.choose = 0
  }

  // 获取总价
  getTotalPrice() {
    return this.goods.price * this.choose
  }
  // 商品是否有选中
  isChoose() {
    return this.choose > 0
  }
  // 增加商品
  increase() {
    this.choose++
  }
  // 减少商品
  decrease() {
    if (this.choose > 0) {
      this.choose--
    }
  }
}

// 总体信息
class MainInfo {
  constructor() {
    this.deliveryFees = 5
    this.minimumDeliveryFee = 30
    const goodsList = []
    goods.forEach((value) => {
      goodsList.push(new UIGoods(value))
    })
    this.cartGoods = goodsList
  }
  // 获取总价
  getTotalPrice() {
    let sum = 0
    this.cartGoods.forEach((val) => {
      sum += val.getTotalPrice()
    })
    return sum
  }
  // 增加商品
  increase(index) {
    this.cartGoods[index].increase()
  }
  // 减少商品
  decrease(index) {
    this.cartGoods[index].decrease()
  }
  // 获取总商品数量
  getTotalGoodsNum() {
    let sum = 0
    this.cartGoods.forEach(value => {
      sum += value.choose
    })
    return sum
  }

  // 购物车中是否有商品
  hasGoodsInCart() {
    return this.getTotalGoodsNum() > 0
  }
  // 是否满配送费
  isFullDeliveryFee() {
    return this.getTotalPrice() >= this.minimumDeliveryFee
  }
}

// 界面信息
class UI {
  constructor() {
    this.UIData = new MainInfo()
    this.dom = {
      goodsList: document.querySelector('.goods-list'),
      deliveryFees: document.querySelector('.footer-car-tip'),
      footerPay: document.querySelector('.footer-pay'),
      footerPaySpan: document.querySelector('.footer-pay span'),
      totalPrice: document.querySelector('.footer-car-total'),
      cart: document.querySelector('.footer-car'),
      badge: document.querySelector('.footer-car-badge')
    }
    const rect = this.dom.cart.getBoundingClientRect()
    // 目标点坐标
    this.targetIndex = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 5
    }
    this.createHtml()
    this.updateFooter()
    this.addListeners()
  }
  // 创建商品信息的html
  createHtml() {
    let html = ''
    this.UIData.cartGoods.forEach((value, index) => {
      console.log(value)
      html += `<div class="goods-item">
          <img src="${value.goods.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${value.goods.title}</h2>
            <p class="goods-desc">
              ${value.goods.desc}
            </p>
            <p class="goods-sell">
              <span>月售 ${value.goods.sellNumber}</span>
              <span>好评率${value.goods.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${value.goods.price}</span>
              </p>
              <div class="goods-btns">
                <i index="${index}" class="iconfont i-jianhao"></i>
                <span>0</span>
                <i index="${index}" class="iconfont i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>`
    })
    this.dom.goodsList.innerHTML = html
  }

  // 添加商品
  increaseUI(index) {
    this.UIData.increase(index)
    this.updateDataUI(index)
  }
  // 减少商品
  decreaseUI(index) {
    this.UIData.decrease(index)
    this.updateDataUI(index)
  }

  // 更新相关显示信息
  updateDataUI(index) {
    // 加减号显示隐藏
    const dom = this.dom.goodsList.children[index]
    if (this.UIData.cartGoods[index].isChoose()) {
      dom.classList.add('active')
    } else {
      dom.classList.remove('active')
    }
    // 数据修改
    const numDom = dom.querySelector('.goods-btns span')
    numDom.textContent = this.UIData.cartGoods[index].choose
    this.jump(index)
    this.updateFooter()
  }

  // 更新页脚数据
  updateFooter() {
    // 得到总价
    const total = this.UIData.getTotalPrice()
    // 设置配送费
    this.dom.deliveryFees.textContent = `配送费￥${this.UIData.deliveryFees}`
    // 设置配送费还差多少元起送
    if (this.UIData.isFullDeliveryFee()) {
      this.dom.footerPay.classList.add('active')
    } else {
      this.dom.footerPay.classList.remove('active')
      const diff = Math.round(this.UIData.minimumDeliveryFee - total)
      this.dom.footerPaySpan.textContent = `还差￥${diff}元起送`
    }
    // 设置总价
    this.dom.totalPrice.textContent = total.toFixed(2)
    // 设置购物车样式
    if (this.UIData.hasGoodsInCart()) {
      this.dom.cart.classList.add('active')
    } else {
      this.dom.cart.classList.remove('active')
    }
    // 设置购物车数量
    this.dom.badge.textContent = this.UIData.getTotalGoodsNum()
  }

  // 绑定事件
  addListeners() {
    this.dom.cart.addEventListener('animationend',function () {
      this.classList.remove('animate')
    })
    // 点击加号减号事件
    this.dom.goodsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('i-jiajianzujianjiahao')) {
        const index = +e.target.getAttribute('index')
        this.increaseUI(index)
      } else if (e.target.classList.contains('i-jianhao')) {
        const index = +e.target.getAttribute('index')
        this.decreaseUI(index)
      }
    })
  }

  // 购物车动画
  cartAnimate() {
    this.dom.cart.classList.add('animate')
  }
  // 加号动画
  jump(index) {
    // 获取目标点的位置
    const dom = this.dom.goodsList.children[index].querySelector('.i-jiajianzujianjiahao')
    const rect = dom.getBoundingClientRect()
    const start = {
      x: rect.x,
      y: rect.y
    }
    // 创建加号
    const addDom = document.createElement('div')
    addDom.classList.add('add-to-car')
    // 设置初始位置
    addDom.style.transform = `translateX(${start.x}px)`
    const i = document.createElement('i')
    i.className = 'iconfont i-jiajianzujianjiahao'
    i.style.transform = `translateY(${start.y}px)`
    addDom.appendChild(i)
    document.body.appendChild(addDom)
    addDom.clientWidth
    // 设置目标位置
    addDom.style.transform = `translateX(${this.targetIndex.x}px)`
    i.style.transform = `translateY(${this.targetIndex.y}px)`
    // 绑定结束事件
    addDom.addEventListener('transitionend',() => {
      addDom.remove()
      this.cartAnimate()
    }, {
      once: true
    })
  }
}

const ui = new UI()