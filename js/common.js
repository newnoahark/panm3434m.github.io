$(function(){
	$('.screen>div').click(function(){
		var index = $(this).index();
		$(this).siblings('ul').eq(index).removeClass('none').siblings('ul').addClass('none');
		$('#modle').fadeIn();
	})
	$('#modle').click(function(){
		$(this).fadeOut();
		$('.screen ul').stop(true,false).slideUp();
	})
	$('.screen ul li').click(function(){
		var index = $(this).parent().index() - 3;
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('.screen>div').eq(index).removeClass('active');
		}else{
			$(this).addClass('active').siblings().removeClass('active');
			$('.screen>div').eq(index).addClass('active');
		}
		$(this).parent().addClass('none');
		$('#modle').fadeOut();
	})
	
	$('.search_screen ul li').click(function(){
		$('.search_screen_list .tab').eq($(this).index()).removeClass('none').siblings().addClass('none');
	})
	
	$('.pass_deabled .pass').click(function(){
		layer.open({
		    content: '您是否确认该项任务通过审核？'
		    ,btn: ['确定', '取消']
		    ,yes: function(index){
		      location.reload();
		      layer.close(index);
		    }
		  });
	});
	$('.select li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	})
	$('.select2 li').click(function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	})
	
	$('.test_name ul li').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	})
	
	
})