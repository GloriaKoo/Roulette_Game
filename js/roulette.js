var wheel = $('.wheelBody')
var contentCon = $('.contentCon')
var winBar = $('.winBar')
var length, preAngle
var starAngle = 0
var giftBox = []
var data = []
var result


var shuffle = function(a, b) {
	let num = Math.random() > 0.5 ? -1 : 1
	return num
}

var showGift = function(r) {
	$('.pattern')
		.eq(r)
		.addClass('picked')
	$('.content')
		.eq(r)
		.addClass('picked')
	$('h2').text(`${data[r].text}!`)
	
	winBar.fadeIn(300)
}

var again = function(r) {
	$('.pattern').removeClass('picked')
	$('.content').removeClass('picked')
	winBar.fadeOut(300)
}

var handRotate = function(gift, second) {
	let goAngle = starAngle + 1440 + gift * preAngle - (starAngle % 360)
	starAngle = goAngle
	$('.hand').css({
		transition: `${second}ms`,
		transform: `rotate(${goAngle}deg)`,
	})
	setTimeout(function() {
		showGift(gift)
	}, second)
}

var clickHandler = function() {
	$('.hand').off('click')
	if (giftBox.length == 0) { //第一次轉?
		init()
	} else {
		again()
		let gift = giftBox.sort(shuffle).pop(); //排序，回傳最後一個
		handRotate(gift, 3000);
		result=data[gift].text;
		
	}
}

var init = function() {
	starAngle = 0
	giftBox = []
	winBar.hide()
	wheel.html('<div class="hand"><img src="img/hand.svg" /></div>')
	contentCon.html('')
	$('.hand').css({
		transition: 'unset',
		transform: 'unset',
	})
	$('.hand').off('click')
	console.log(wheel_array);



		data = wheel_array;
		data.forEach((item, index) => {
			preAngle = 360 / data.length
			let patternAngle = preAngle / -2 + index * preAngle
			let pattern = $('<div class="pattern"></div>')
			let inner = $('<div class="inner"></div>')
			let content = $(
				`<div class="content"><h3>${item.icon}</h3><p>${item.text}</p></div>`
			);
			
			
			pattern.css('transform', `rotate(${patternAngle}deg)`)
			inner.css('transform', `rotate(${preAngle}deg)`)
			content.css('transform', `rotate(${index * preAngle}deg)`)
			pattern.append(inner)
			wheel.append(pattern)
			contentCon.append(content)
			
			for (let i = 0; i < item.num; i++) {
			giftBox.push(index)
			}
			$('.hand').off('click')
		})
	
}

init()
