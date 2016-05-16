/**
 * Created by Phoebe on 2016/5/16.
 * ����������Զ���ȫ
 * <input type="text" class="select-text" value="">
 */
$(function(){
    //��ȡ��������
    var $selectInput = $('.select-text');
    //�ر�������ṩ���������Զ����
    $selectInput.attr('autocomplete','off');
    //�����Զ���������б�
    var $autocomplete = $('<div class="autocomplete"></div>').hide().insertAfter('.select-text');
    //��������б�����
    var clear = function(){
        $(this).empty().hide();
    };
    //ע���¼����������ʧȥ�������clear
    $selectInput.blur(function(){
        setTimeout(clear,50000);
    });
    var selectedItem = null;
    var timeoutid = null;
    var setSelectedItem = function(item){
        selectedItem = item;
        if(selectedItem < 0){
            selectedItem = $(this).find('li').length -1;
        }else if(selectedItem > $(this).find('li').length - 1){
            selectedItem = 0;
        }
        $(this).find('li').removeClass('highlight').eq(selectedItem).addClass('highlight');
    };
    var ajax_request = function(me){
        $.ajax({
            'url':'1.json',//��������ַ
            'data':{'search-text':me.val()},
            'dataType':'json',
            'type':'get',
            'success':function(data){
                var list = [];
//					var reg = /\l/;
                for(var i = 0;i<data.length;i++){
                    if((data[i].name).indexOf(me.val()) !== -1){
                        list[i] = data[i].name;
                    }
                }
                if(list.length){
                    $.each(list,function(index,list){
                        $('<li></li>').text(list).appendTo(me.siblings('.autocomplete'))
                            .addClass('clickable')
                            .hover(function(){
                                $(this).siblings().removeClass('highlight');
                                $(this).addClass('highlight');
                                selectedItem = index;
                            },
                            function(){
                                $(this).removeClass('highlight');
                                selectedItem = -1;
                            }).on('click',function(){
                                me.val(list);
                                me.siblings('.autocomplete').empty().hide();
                            });
                    });
                    var ypos = $selectInput.height() + 2;
                    var xpos = 10;
                    me.siblings('.autocomplete').css({
                        'width':me.css('width'),
                        'position':'absolute',
                        'left':xpos + 'px',
                        'top':ypos + 'px'
                    });
                    setSelectedItem(0);
                    me.siblings('.autocomplete').show();
                }
            }
        })
    };
    $selectInput.keyup(function(event){
        //��ĸ���֣��˸񣬿ո�
        var $this = $(this);
        if(event.keyCode > 40 || event.keyCode == 8 || event.keyCode == 32){
            $this.siblings('.autocomplete').empty().hide();
            clearTimeout(timeoutid);
            timeoutid = setTimeout(ajax_request($this),100);
        }else if(event.keyCode == 38){
            //�� selectedItem = -1��������뿪
            if(selectedItem == -1){
                setSelectedItem($this.siblings('.autocomplete').find('li').length -1);
            }else{
                //������1
                setSelectedItem(selectedItem -1);
            }
            event.preventDefault();
        }else if(event.keyCode == 40){
            //��
            if(selectedItem == -1){
                setSelectedItem(0);
            }else{
                setSelectedItem(selectedItem + 1);
            }
            event.preventDefault();
        }
    }).keypress(function(event){
        //enter��
        var $this = $(this);
        if(event.keyCode == 13){
            //�б�Ϊ�ջ�������뿪���µ�ǰû������ֵ
            if($this.siblings('.autocomplete').find('li').length == 0 || selectedItem == -1){
                return;
            }
            $selectInput.val($this.siblings('.autocomplete').find('li').eq(selectedItem).text());
            $this.siblings('.autocomplete').empty().hide();
            event.preventDefault();
        }
    }).keydown(function(event){
        //esc��
        var $this = $(this);
        if(event.keyCode == 27){
            $this.siblings('.autocomplete').empty().hide();
            event.preventDefault();
        }
    });
    $(window).resize(function(){
        var ypos = $selectInput.height() + 2;
        var xpos = 10;
        $autocomplete.css({
            'width': $selectInput.css('width'),
            'position':'absolute',
            'left':xpos + "px",
            'top':ypos +"px"
        })
    })

})
