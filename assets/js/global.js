var isDevelopment = false;
var isMobile = $(window).width() <= 600;
$(document).ready(function() {
    

    animationItems = [
        { selector: $("#container"), 
            animation: {
                name: "circleInCenter",
            }
        },
        { selector:  $("header > .title > .bg"), 
            animation: {
                name: "showIn",
                delay: 400
            }
        },
        { selector:  $("header > .title > .img"), 
            animation: {
                name: "zoomIn",
                delay: 700
            }
        },
        {
            selector: $("#content"),
            animation: {
                name:  ($(window).width() > 600 ? "slideInLeft" : "runInLeft"),
                delay: 700
            }
        },
        {
            selector: $("#menu"),
            animation: {
                name: ($(window).width() > 600 ? "fadeInRight" : "runInUp"),
                delay: 700
            }
        },
        {
            selector: $("header > .title > .info > h1"),
            animation: {
                name: "fadeInUp",
                delay: 1100
            }
        },
        {
            selector: $("header > .title > .info > p"),
            animation: {
                name: "fadeInUp",
                delay: 1400
            }
        },
        {
            selector: $("header > .buttons > .item").eq(0),
            animation: {
                name: "runInLeft",
                delay: 1200
            }
        },
        {
            selector: $("header > .buttons > .item").eq(1),
            animation: {
                name: "runInRight",
                delay: 1200
            }
        },
        {
            selector: $("header > .contacts > a:eq(1)"),
            animation: {
                name: "bounceIn",
                delay: 1500
            }
        },
        {
            selector: $("header > .contacts > a:not(:eq(1))"),
            animation: {
                name: "bounceIn",
                delay: 1700
            }
        },
            
    ]
    if(isDevelopment) {
        animationItems = [];
        $("#content").addClass("animation-in");
    }

    timeoutDictionary = {};
     
    var isMenuAnimationActive = false;
    $("#menu > .item").click(function() {
        
        if(!isMenuAnimationActive) {
            isMenuAnimationActive = true;
            animations = {
                leftOut : (!isMobile ? "turnUpOut" : "runOutLeft"),
                leftIn : (!isMobile ? "turnUpIn" : "runInRight"),
                rightOut : (!isMobile ? "turnDownOut" : "runOutRight"),
                rightIn : (!isMobile ? "turnDownIn" : "runInLeft"),
            }
        
            var _this = $(this);
            if(!_this.hasClass("active")) {
                var index = _this.index();
                var activeIndex = _this.siblings(".active").index();
                _this.addClass("active").siblings().removeClass("active");

                var activeCont = $("#content > .item").eq(activeIndex);
                var currentCont = $("#content > .item").eq(index);

                if(!isMobile)
                    activeCont.getNiceScroll().remove();
                 
                currentCont.show(0).scrollTop(0).animateCss((index > activeIndex ? animations.leftIn : animations.rightIn), 0, true, (p) => {
                    p.addClass("show");
                    if(!isMobile)
                        p.niceScroll(niceScrollSettings);
                });
                activeCont.animateCss((index > activeIndex ? animations.leftOut : animations.rightOut), 0, true, (p) => {
                    p.removeClass("show");
                    p.hide(0);
                    isMenuAnimationActive = false;
                });

                if(isMobile) {
                    var scrollHeight = $("header").height() + $("#menu").height();
                    $("html").animate({"scrollTop":scrollHeight}, 300, 'swing');
                }
          

            } else {
                isMenuAnimationActive = false;
            }
        }
    });
    
    $("#contactMe").click(() => {
        $("#btnTabContact").click();
        return false;
    });
    $("#contact-form").submit(function(e) {
        e.preventDefault();
        $form = $("#contact-form");
        $this = $("#btnSendMail");
        var formData = $form.serializeArray();
        var data = {};
        $this.attr("disabled", "disabled");
        var clearDisabledFunc = () => {
            $.each(formData, (i, item) => {
                $form.find('[name="'+item.name+'"]').removeAttr("disabled");
                $this.removeAttr("disabled")
            });
        }
        $.each(formData, (i, item) => {
            data[item.name] = item.value;
            $form.find('[name="'+item.name+'"]').attr("disabled","disabled");
        });
        swal({
            title: 'Emin misiniz?',
            text: "Mesaji göndermek istediğinize emin misiniz?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
            allowOutsideClick: false,
            preConfirm: function() {
                swal.showLoading();
                return new Promise(function(resolve) {
                    $.ajax({ 
                        type: 'POST', 
                        url: 'php/sendmail.php', 
                        data: data, 
                        dataType: 'json',
                        success: function (r) { 
                            swal({
                                title: (r.Status ? "Mesajınız Gönderildi" : "Mesajınız Gönderilemedi"),
                                text: r.Message,
                                type: (r.Status ? "success" : "error"),
                                confirmButtonText: 'Tamam',
                            });
                            if(r.Status) {
                                $.each(formData, (i, item) => {
                                    $form.find('[name="'+item.name+'"]').val('');
                                });
                            }
                        },
                        error: (a, b ,c) => {
                            swal({
                                title: "Mesajınız Gönderilemedi",
                                text: "Mesaj gönderilemedi, lütfen diğer iletişim yöntemlerini deneyin.",
                                type: "error",
                                confirmButtonText: 'Tamam',
                            });
                        },
                        complete: () => {
                            clearDisabledFunc();
                        }
                    });          
                });
            }
        }).then((result) => {
            if(result.dismiss) 
                clearDisabledFunc();
        });;
        
    })
   
    $("[data-tooltip]").each(function(i, item) {
        var _this = $(this);
        var style = _this.data("tooltip");
        var title = _this.data("title");
        
        _this
            .addClass("tooltip")
            .prepend('<div class="tooltip-container tc-'+style+'">'+title+'</div>');
    });

    $("[data-lazy]").each(function(i, item) {
        var _this = $(item);
        var path = _this.attr("src");
        var parentIndex = 0;
        if(_this.data("lazy") != "")
            parentIndex = _this.data("lazy");
        
        var elem = _this;
        for(var i = 0;i < parentIndex;i++)
            elem = elem.parent();


        var tmpImg = new Image() ;
        tmpImg.src = path;
        tmpImg.onload = function() {
            setTimeout(() => {
                elem.addClass("loaded");
            });
        };
    });
    

    
});
var animationItems;
function initializeAnimations(afterInit) {
    $("#site").addClass("initialize");
    setTimeout(() => {
        $("#preloader").remove();
    }, 2000);
    $.each(animationItems, function(i, animationItem) {
        if(animationItem != null) {
            var delay = animationItem.animation.delay;
            animationItem.selector.css("opacity",0);
            var animationFunc = () => {
                animationItem.selector
                    .addClass("animation-in")
                    .animateCss(animationItem.animation.name);
            };
            if(animationItem.animation.delay) {
                if(!timeoutDictionary[delay])
                    timeoutDictionary[delay] = [];

                timeoutDictionary[delay].push(animationFunc);
            } else
               animationFunc();
        }
    });
    var biggestTimeout = 0;
    $.each(timeoutDictionary, (delay, funcs) => {
        if(parseFloat(delay) > biggestTimeout)
            biggestTimeout = delay;
        setTimeout(() => {
            $.each(funcs, (i, func) => {
                func();
            });
        }, delay);
    });  
    setTimeout(afterInit, biggestTimeout);
}

$.fn.animateCss = function (animationName,delay,playAgain,onFinish) {
    var selector = $(this);
    $.each(selector, (i, item) => {
        var _this = $(item);
        var func = () => {
            if(animationName.indexOf("In") != -1)
                _this.css("opacity",1);
            _this.addClass('animated ' + animationName);
            _this.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                if(playAgain != undefined ? playAgain : false)
                    _this.removeClass('animated').removeClass(animationName);
                if(onFinish != undefined)
                    onFinish(_this);
            });
        }
        if(delay)
            setTimeout(func,(delay != undefined ? delay : 0));
        else
            func();
    });
   
    return selector;
}

$.fn.loader = function(type) {
    return this.each((index, selector) => {
        var $this = $(selector);
        if(type == "show" || type == undefined) {
            $this.addClass("loader-content");
            $this.prepend('<div class="loader-wrapper on"><div class="loader"></div></div>')
        } else if(type == "hide") {
            $this.removeClass("loader-content");
            $this.children(".loader-wrapper").remove();
        }
    });
}
var niceScrollSettings = {
    cursorcolor: '#ababab',
    cursorwidth: '6px',
    cursorborder: 'none',
    railpadding: { top: 6, right: 2, left: 0, bottom: 6 },
    cursorborderradius: '3px'
};
$(window).bind("load", function() {
    
    
    setTimeout(() => {
        initializeAnimations(() => {
            if(!isMobile) {
                $("#content > .item:first-child").niceScroll(niceScrollSettings);
            }
        });
    },isDevelopment ? 0 : 3000);
    
    
    if(!isDevelopment && $(window).width() > 600) {
        setTimeout(() => {
            $("#triangle-animation-context").triangleAnimations();
        }, 6000);
    }
});