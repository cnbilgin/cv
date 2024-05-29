(function($){
    $.fn.triangleAnimations = function(options) {
        let windowWidth = $(window).width();
        let windowHeight = $(window).height();

        var settings = $.extend({
            interval : 1000,
            createItemCount : 3,
            max : 30
        }, options );

        return this.each(function(contentIndex ,contentSelector) {
            let content = $(contentSelector);  

            content.css({
                "width" : "100vw",
                "height" : "100vh",
                "position" : "fixed",
                "top" : "0",
                "left" : "0",
                "overflow" : "hidden"
            });

            initializeTriangleAnimations();

        
            function initializeTriangleAnimations() {
                setInterval(() => {
                    for(var i = 0;i < settings.createItemCount;i++) {
                        interval();
                    }
                }, settings.interval);
            }

            function interval() {
                if(settings.max > content.children().length) {
                    let animationDuration = Math.round(Math.random() * 10 + 5);
                    let triangle = createTriangle(animationDuration);
                    let degree = Math.round(Math.random() * 360);

                    var cosX = Math.cos((degree * (Math.PI / 180)));
                    var sinX = Math.sin((degree * (Math.PI / 180)));
                    var rotationRand = Math.round(Math.random() * 720 + 360);

                    content.append(triangle);

                    setTimeout(() => {
                        triangle.css({
                            "left" : (windowWidth / 2 * cosX) * 2 + (windowWidth / 2),
                            "top" : (windowHeight / 2 * sinX) * 2 + (windowHeight / 2),
                            "transform" : "rotate(" + rotationRand + "deg)"
                        });
                    },100);

                    triangle.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
                        triangle.remove();
                    });
                }
            }

            function createTriangle(duration) {
                let triangle = $('<div></div>');
                let size = Math.round(Math.random() * 40 + 40);
                triangle.css({
                    "width" : "0",
                    "height" : "0",
                    "position" : "absolute",
                    "left" : (windowWidth / 2) - size,
                    "top" : (windowHeight / 2) - size,
                    "border-left" : size + "px solid transparent",
                    "border-right" : size + "px solid transparent",
                    "border-bottom" : (size * 1.5) + "px solid rgba(255, 255, 255, 0.3)",
                    "transition" : "all linear " + duration + "s"
                });

                return triangle;
            }
        });
    }
})(jQuery);